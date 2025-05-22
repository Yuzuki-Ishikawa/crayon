import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Tables } from '@/lib/database.types';
import LpClientContent from '@/components/LpClientContent';

// Supabaseクライアント作成ヘルパー (記事一覧ページなどから流用)
const createSupabaseServerClient = (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: CookieOptions) { try { cookieStore.set({ name, value, ...options }); } catch (error) { /* Ignore */ } },
        remove(name: string, options: CookieOptions) { try { cookieStore.set({ name, value: '', ...options }); } catch (error) { /* Ignore */ } },
      },
    }
  );
};

// 記事データの型 (記事一覧から流用、必要に応じて調整)
export type ArticleForLp = Pick<
  Tables<'copy_entries'>,
  'id' | 'headline' | 'copy_text' | 'advertiser' | 'key_visual_urls' | 'serial_number' | 'publish_at'
> & {
  signedThumbnailUrl?: string;
};

async function getLpData() {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore);

  // 最新記事1件 (特集記事用)
  const { data: featuredArticleData, error: featuredError } = await supabase
    .from('copy_entries')
    .select('id, headline, copy_text, advertiser, key_visual_urls, serial_number, publish_at')
    .eq('status', 'published')
    .order('publish_at', { ascending: false })
    .limit(1)
    .single();

  if (featuredError) {
    // console.error('Error fetching featured article for LP:', featuredError);
  }

  // ArticleForLpから 'signedThumbnailUrl' を除いた型を定義 (DBからの取得データ用)
  type DbArticleData = Omit<ArticleForLp, 'signedThumbnailUrl'>;

  // 最新記事リスト (カルーセル用 - 特集記事を除いて5件取得)
  let latestArticlesData: DbArticleData[] | null = null; // Use DbArticleData
  const { data: initialLatestArticles, error: latestError } = await supabase
    .from('copy_entries')
    .select('id, headline, copy_text, advertiser, key_visual_urls, serial_number, publish_at') // Ensure this matches DbArticleData
    .eq('status', 'published')
    .order('publish_at', { ascending: false })
    .limit(featuredArticleData ? 6 : 5);

  if (latestError) {
    // console.error('Error fetching latest articles for LP:', latestError);
  } else if (initialLatestArticles) {
    const typedInitialArticles = initialLatestArticles as DbArticleData[]; // Type assertion
    latestArticlesData = featuredArticleData 
      ? typedInitialArticles.filter(article => article.id !== featuredArticleData.id).slice(0, 5)
      : typedInitialArticles.slice(0, 5);
  }
  
  // サムネイルURLの署名
  const articlesToProcessForSigning: (DbArticleData | null)[] = []; // Use DbArticleData
  if (featuredArticleData) {
    articlesToProcessForSigning.push(featuredArticleData as DbArticleData); // Type assertion
  }
  if (latestArticlesData) {
    latestArticlesData.forEach(latestArticle => {
      if (!featuredArticleData || latestArticle.id !== featuredArticleData.id) {
        articlesToProcessForSigning.push(latestArticle);
      }
    });
  }
  
  const articlesToSign = articlesToProcessForSigning.filter(Boolean) as DbArticleData[]; // Use DbArticleData
  const pathsToSign: string[] = [];
  const articlesWithPaths = articlesToSign.map(article => {
    if (article.key_visual_urls && article.key_visual_urls.length > 0 && article.key_visual_urls[0]) {
      const path = article.key_visual_urls[0].replace(/^\/?(public\/)?key-visuals\//, '');
      pathsToSign.push(path);
      return { ...article, thumbnailPathKey: path };
    }
    return { ...article, thumbnailPathKey: null };
  });

  let signedUrlsMap: Record<string, string> = {};
  if (pathsToSign.length > 0) {
    const { data: signedData, error: signError } = await supabase.storage
      .from('key-visuals')
      .createSignedUrls(pathsToSign, 60 * 5); // 5分間有効
    if (signError) {
      // console.error("Error creating signed URLs for LP:", signError);
    } else if (signedData) {
      signedUrlsMap = signedData.reduce((acc, item) => {
        if (item.signedUrl && item.path) acc[item.path] = item.signedUrl;
        return acc;
      }, {} as Record<string, string>);
    }
  }

  const processArticle = (articleWithKey: typeof articlesWithPaths[number] | undefined): ArticleForLp | null => {
    if (!articleWithKey) return null;
    const article = articleWithKey as Tables<'copy_entries'> & { thumbnailPathKey?: string | null }; // 型アサーションを明確に

    const thumbnailUrl = article.thumbnailPathKey ? signedUrlsMap[article.thumbnailPathKey] : (
      article.key_visual_urls && article.key_visual_urls.length > 0 && article.key_visual_urls[0] ? 
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/key-visuals/${article.key_visual_urls[0].replace(/^\/?(public\/)?key-visuals\//, '')}` 
      : '/placeholder-image.jpg'
    );
    return {
      id: article.id,
      headline: article.headline,
      copy_text: article.copy_text,
      advertiser: article.advertiser,
      key_visual_urls: article.key_visual_urls,
      serial_number: article.serial_number,
      publish_at: article.publish_at,
      signedThumbnailUrl: thumbnailUrl,
    };
  };
  
  const featuredArticleProcessed = processArticle(articlesWithPaths.find(a => featuredArticleData && a.id === featuredArticleData.id));
  const latestArticlesProcessed = articlesWithPaths
    .filter(a => latestArticlesData?.some(la => la.id === a.id && (!featuredArticleData || la.id !== featuredArticleData.id)))
    .map(article => processArticle(article))
    .filter(Boolean) as ArticleForLp[];

  return { featuredArticle: featuredArticleProcessed, latestArticles: latestArticlesProcessed };
}

export default async function LandingPage() {
  const { featuredArticle, latestArticles } = await getLpData();

  return (
    <LpClientContent featuredArticle={featuredArticle} latestArticles={latestArticles} />
  );
} 