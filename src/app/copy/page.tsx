import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/database.types';
import CopyListTabs from '@/components/CopyListTabs';
import { Tables } from '@/lib/database.types';

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

export type CopyEntryForList = Tables<'copy_entries'> & {
  signedThumbnailUrl?: string;
};

export default async function BackNumberPage() {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore);

  // Fetch published copy entries, ordered by serial number descending
  const { data: copyEntries, error } = await supabase
    .from('copy_entries')
    .select(`
      id,
      headline,
      copy_text,
      explanation,
      advertiser,
      industry_tags,
      category_tags,
      key_visual_urls,
      status,
      serial_number,
      publish_at,
      awards,
      copywriter,
      created_at,
      source,
      updated_at,
      youtube_url,
      tags,
      year_created
    `)
    .eq('status', 'published')
    .order('serial_number', { ascending: false });

  if (error) {
    throw error; // エラーをスローしてNext.jsのエラーハンドリングに任せる
  }

  const pathsToSign: string[] = [];
  const entriesWithKeys = copyEntries.map(entry => {
    if (entry.key_visual_urls && entry.key_visual_urls.length > 0) {
      const firstKeyVisualPath = entry.key_visual_urls[0].split('/').slice(-2).join('/'); // storage_bucket/image.jpg
      pathsToSign.push(firstKeyVisualPath);
      return { ...entry, thumbnailPath: firstKeyVisualPath }; 
    }
    return { ...entry, thumbnailPath: null };
  });

  let signedUrlsMap: Record<string, string> = {};
  if (pathsToSign.length > 0) {
    const { data: signedData, error: signError } = await supabase.storage.from('copy-entry-images').createSignedUrls(pathsToSign, 60 * 5);
    if (signError) {
      // エラーがあっても処理を続けるが、URLは未署名になる
    } else if (signedData) {
      signedUrlsMap = signedData.reduce((acc: Record<string, string>, item) => {
        if (item.signedUrl && item.path) {
          acc[item.path] = item.signedUrl;
        }
        return acc;
      }, {});
    }
  }

  const processedEntries: CopyEntryForList[] = entriesWithKeys.map(entry => ({
    ...entry,
    signedThumbnailUrl: entry.thumbnailPath ? signedUrlsMap[entry.thumbnailPath] : undefined,
  }));

  // タグ一覧を抽出
  const allIndustryTags = Array.from(new Set(processedEntries.flatMap(e => e.industry_tags ?? [])));
  const allCategoryTags = Array.from(new Set(processedEntries.flatMap(e => e.category_tags ?? [])));

  return (
    <div className="container mx-auto pt-6 pb-8 sm:px-6 lg:px-8">
      <CopyListTabs copyEntries={processedEntries} allIndustryTags={allIndustryTags} allCategoryTags={allCategoryTags} />
    </div>
  );
} 