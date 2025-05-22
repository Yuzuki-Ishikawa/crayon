import CopyTabs from '@/components/CopyTabs';

export default function LoadingCopyDetail() {
  // CopyTabs に渡すダミーデータ（Skeleton表示に必要な構造のみ）
  // 実際のデータは不要だが、propsの型を満たすためにnullや空配列を設定
  const dummyProps = {
    isLoading: true,
    explanation: null,
    copyText: null,
    advertiser: null,
    copywriter: null,
    yearCreated: null,
    awards: null,
    industry_tags: [],
    category_tags: [],
    source: [],
    headline: null,
    volNumber: null,
    keyVisualUrls: [], // Skeletonではカルーセル自体がSkeletonになる想定
    publishAt: null,
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-3xl bg-white shadow-lg rounded-lg my-8">
      {/* CopyTabsのisLoadingがtrueの時の表示をそのまま利用 */}
      <CopyTabs {...dummyProps} />

      {/* Prev/Next buttons and Back link placeholders (optional, can be simpler) */}
      <div className="mt-8 mb-4 flex justify-between items-center">
        {/* <Skeleton width={100} height={36} />
        <Skeleton width={100} height={36} /> */}
      </div>
      <div className="mt-8 text-center">
        {/* <Skeleton width={150} height={24} className="mx-auto" /> */}
      </div>
    </div>
  );
} 