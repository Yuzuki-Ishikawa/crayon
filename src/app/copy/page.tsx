import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/database.types';
import CopyListTabs from '@/components/CopyListTabs'; // 新しいコンポーネント

// Helper function to create Supabase client
const createSupabaseServerClient = (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try { cookieStore.set({ name, value, ...options }) } catch (error) { /* Ignore */ }
        },
        remove(name: string, options: CookieOptions) {
          try { cookieStore.set({ name, value: '', ...options }) } catch (error) { /* Ignore */ }
        },
      },
    }
  );
};

export type CopyEntryForList = Pick<
  Database['public']['Tables']['copy_entries']['Row'],
  'id' | 'serial_number' | 'headline' | 'advertiser' | 'copywriter' | 'key_visual_urls' | 'copy_text'
> & { signedThumbnailUrl?: string };


export default async function BackNumberPage() {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore);

  // Fetch published copy entries, ordered by serial number descending
  const { data: copyEntries, error } = await supabase
    .from('copy_entries')
    .select('id, serial_number, headline, advertiser, copywriter, key_visual_urls, copy_text')
    .eq('status', 'published')
    .order('serial_number', { ascending: false });

  if (error) {
    console.error("Error fetching copy entries:", error);
    // Optionally return an error message component
    return <div>Error loading copy entries.</div>;
  }
  if (!copyEntries) {
    return <div>No copy entries found.</div>;
  }

  // Prepare thumbnail paths and generate signed URLs
  const thumbnailPaths: { id: string, path: string | null }[] = copyEntries.map(entry => {
    const firstImagePath = Array.isArray(entry.key_visual_urls) && entry.key_visual_urls.length > 0
      ? entry.key_visual_urls[0]
      : null;
    const cleanedPath = firstImagePath ? firstImagePath.replace(new RegExp('^\\/?(public\\/)?key-visuals\\/'), '') : null;
    return { id: entry.id, path: cleanedPath };
  }).filter(item => item.path !== null); // Only try to sign URLs for entries with a path

  const signedUrlMap = new Map<string, string>();

  if (thumbnailPaths.length > 0) {
    const bucketName = 'key-visuals';
    const pathsToSign = thumbnailPaths.map(item => item.path!); // Non-null asserted due to filter

    try {
      const { data: signedData, error: signError } = await supabase.storage
        .from(bucketName)
        .createSignedUrls(pathsToSign, 60 * 5); // 5 minutes validity for thumbnails

      if (signError) {
        console.error('Error creating signed URLs for thumbnails:', signError);
      } else if (signedData) {
        // Map signed URLs back to their original entry ID
        signedData.forEach((signedItem, index) => {
          const originalItemId = thumbnailPaths[index].id;
          if (signedItem.signedUrl) {
            signedUrlMap.set(originalItemId, signedItem.signedUrl);
          }
        });
      }
    } catch (e) {
      console.error('Exception during signed URL generation:', e);
    }
  }

  // Combine data with signed URLs
  const processedEntries: CopyEntryForList[] = copyEntries.map(entry => ({
    ...entry,
    signedThumbnailUrl: signedUrlMap.get(entry.id),
  }));


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">バックナンバー</h1>
      <CopyListTabs copyEntries={processedEntries} />
    </div>
  );
} 