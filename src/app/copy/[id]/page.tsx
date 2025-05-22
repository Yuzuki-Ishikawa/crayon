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
    // console.error("Invalid ID format:", copyId); // Consider logging to a server-side logger instead
    notFound();
  }

  // Fetch data using id
  const { data, error } = await supabase
    .from('copy_entries')
    .select('*')
    .eq('id', copyId) // Fetch by id
    .single();

  if (error) {
    // console.error("Error fetching copy entry:", error); // Consider logging to a server-side logger instead
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
      // console.error('Failed to create signed URLs:', signErr); // Consider logging to a server-side logger instead
    } else {
      signedUrls = signed?.map(obj => obj.signedUrl) ?? [];
    }
  }
  // const tags = (Array.isArray(data.tags) ? data.tags : []) as string[]; // 古いtags処理をコメントアウト

  // 新しいタグ処理: industry_tags と category_tags を取得
  const industry_tags = (Array.isArray(data.industry_tags) ? data.industry_tags.filter(Boolean) : []) as string[];
  const category_tags = (Array.isArray(data.category_tags) ? data.category_tags.filter(Boolean) : []) as string[];

  // Fetch previous and next article IDs
  const { data: prevEntry } = await supabase
    .from('copy_entries')
    .select('id')
    .lt('serial_number', data.serial_number)
    .eq('status', 'published')
    .order('serial_number', { ascending: false })
    .limit(1)
    .single();
  const { data: nextEntry } = await supabase
    .from('copy_entries')
    .select('id')
    .gt('serial_number', data.serial_number)
    .eq('status', 'published')
    .order('serial_number', { ascending: true })
    .limit(1)
    .single();

  return (
    // Restore original container structure
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* YouTube埋め込み */}
      {data.youtube_url && (
        <div className="mb-8 aspect-video w-full max-w-xl mx-auto">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${extractYouTubeId(data.youtube_url)}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      )}
      <CopyTabs
        // Pass all required props
        explanation={data.explanation}
        copyText={data.copy_text}
        advertiser={data.advertiser}
        copywriter={data.copywriter}
        yearCreated={data.year_created}
        awards={data.awards}
        // tags={tags} // 古いtagsプロパティ
        industry_tags={industry_tags} // 新しいindustry_tagsプロパティ
        category_tags={category_tags} // 新しいcategory_tagsプロパティ
        source={data.source as { title: string; url: string }[] | null | undefined}
        volNumber={data.serial_number || data.id}
        keyVisualUrls={signedUrls}
        publishAt={data.publish_at}
      />

      {/* Previous/Next Article Buttons */}
      <div className="mt-8 mb-4 flex justify-between items-center">
        {prevEntry && prevEntry.id ? (
          <a 
            href={`/copy/${prevEntry.id}`} 
            className="text-sm font-medium flex items-center gap-1 py-2 px-3"
            style={{ color: '#2253A3', textDecoration: 'none' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            前の記事へ
          </a>
        ) : (
          <div /> 
        )}
        {nextEntry && nextEntry.id ? (
          <a 
            href={`/copy/${nextEntry.id}`} 
            className="text-sm font-medium flex items-center gap-1 py-2 px-3"
            style={{ color: '#2253A3', textDecoration: 'none' }}
          >
            次の記事へ
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          </a>
        ) : (
          <div />
        )}
      </div>

      <div className="mt-8 text-center">
        <a href="/copy" className="text-base font-medium transition-colors duration-200" style={{ textDecoration: 'none' }}>
          &lt; 記事一覧に戻る
        </a>
      </div>
    </div>
  );
}

function extractYouTubeId(url: string): string | null {
  const regExp = /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^\w-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
} 