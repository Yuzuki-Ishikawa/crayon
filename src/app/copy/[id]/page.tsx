import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import type { Database } from '@/lib/database.types';
import CopyTabs from '@/components/CopyTabs';

// Helper function to create Supabase client (make sure this uses @supabase/ssr)
const createSupabaseServerClient = (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient( // Ensure this is from @supabase/ssr
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) { /* Ignore */ }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) { /* Ignore */ }
        },
      },
    }
  )
}

// Parameter type back to id
export default async function CopyDetailPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  // Use the helper with @supabase/ssr client
  const supabase = createSupabaseServerClient(cookieStore) as ReturnType<typeof createServerClient<Database>>;

  // Get id from params
  const copyId = params.id;
  
  // Validate UUID format
  if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(copyId)) {
    console.error("Invalid ID format:", copyId);
    notFound();
  }

  // Fetch data using id
  const { data, error } = await supabase
    .from('copy_entries')
    .select('*')
    .eq('id', copyId) // Fetch by id
    .single();

  if (error) {
    console.error("Error fetching copy entry:", error);
    notFound();
  }
  if (!data) {
    notFound();
  }

  // Signed URL logic (assuming this part was correct)
  const keyVisualPaths = Array.isArray(data.key_visual_urls) ? data.key_visual_urls.filter(Boolean) : [];
  let signedUrls: string[] = [];
  if (keyVisualPaths.length > 0) {
    const bucketName = 'key-visuals';
    const fileNames = keyVisualPaths.map((path: string) => path.replace(/^\/?(public\/)?key-visuals\//, ''));
    const { data: signed, error: signErr } = await supabase.storage
      .from(bucketName)
      .createSignedUrls(fileNames, 3600); // 1 hour
    if (signErr) {
      console.error('Failed to create signed URLs:', signErr);
    } else {
      signedUrls = signed?.map(obj => obj.signedUrl) ?? [];
    }
  }
  const tags = (Array.isArray(data.tags) ? data.tags : []) as string[];

  return (
    // Restore original container structure
    <div className="container mx-auto p-4 max-w-3xl">
      <CopyTabs
        // Pass all required props
        problemBody={data.problem_body}
        explanation={data.explanation}
        copyText={data.copy_text}
        advertiser={data.advertiser}
        copywriter={data.copywriter}
        yearCreated={data.year_created}
        awards={data.awards}
        tags={tags}
        source={data.source} // Assuming data.source is {title, url}[] from DB
        headline={data.headline}
        // Use serial_number for volNumber display
        volNumber={data.serial_number || data.id} // Fallback to id if serial_number is null
        keyVisualUrls={signedUrls}
      />

      {/* Restore back link */}
      <div className="mt-10 text-center">
        <a href="/copy" className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200">&lt; バックナンバー一覧へ</a>
      </div>
    </div>
  );
} 