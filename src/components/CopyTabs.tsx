"use client";

import { useState } from 'react';

interface CopyTabsProps {
  problemBody: string | null;
  explanation: string | null;
  copyText: string | null;
  advertiser: string | null;
  copywriter: string | null;
  yearCreated: number | null;
  awards: string | null;
  tags: string[] | null;
  source: Array<{title: string, url: string}> | null | undefined;
  headline?: string | null;
  volNumber?: string | number | null;
  keyVisualUrls?: string[] | null;
}

function getValidImageUrl(url: string): string | null {
  if (!url) return null;
  // 画像URLがhttp/httpsで始まっていればそのまま
  if (/^https?:\/\//.test(url)) return url;
  // Supabase Storage等のパスの場合は補完（必要に応じて修正）
  // 例: /storage/v1/object/public/xxx → https://<your-project>.supabase.co/storage/v1/object/public/xxx
  // ここはプロジェクトごとにカスタマイズしてください
  return null;
}

export default function CopyTabs({
  problemBody,
  explanation,
  copyText,
  advertiser,
  copywriter,
  yearCreated,
  awards,
  tags,
  source,
  headline,
  volNumber,
  keyVisualUrls,
}: CopyTabsProps) {
  const [activeTab, setActiveTab] = useState<'problem' | 'explanation'>('problem');

  const problemTabClasses = activeTab === 'problem'
    ? 'border-indigo-500 text-indigo-600'
    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
  const explanationTabClasses = activeTab === 'explanation'
    ? 'border-indigo-500 text-indigo-600'
    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';

  // カルーセル（横スクロール）
  const renderCarousel = () => {
    if (!keyVisualUrls || keyVisualUrls.length === 0) {
      return <div className="text-gray-400 text-center py-4">画像がありません</div>;
    }
    return (
      <div className="flex gap-4 overflow-x-auto pb-2 mt-2 mb-4">
        {keyVisualUrls.map((url, idx) => {
          const validUrl = getValidImageUrl(url);
          return (
            <div key={idx} className="w-64 h-48 relative flex-shrink-0 shadow-md rounded-lg overflow-hidden bg-gray-100">
              {validUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={validUrl} alt={`key visual ${idx + 1}`} className="object-cover w-full h-full" />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-400">画像がありません</div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 font-sans">
      {/* vol.XX */}
      {volNumber && (
        <div className="text-center text-sm text-gray-600 font-medium mb-4 text-black">Vol. {volNumber}</div>
      )}

      {/* タブナビゲーション */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 justify-center" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('problem')}
            className={`whitespace-nowrap py-2 px-4 border-b-2 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-t-md ${problemTabClasses} text-black`}
            aria-current={activeTab === 'problem' ? 'page' : undefined}
          >
            問題
          </button>
          <button
            onClick={() => setActiveTab('explanation')}
            className={`whitespace-nowrap py-2 px-4 border-b-2 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-t-md ${explanationTabClasses} text-black`}
            aria-current={activeTab === 'explanation' ? 'page' : undefined}
          >
            解説
          </button>
        </nav>
      </div>

      {/* 問題タブ */}
      {activeTab === 'problem' && (
        <div>
          {/* 見出し */}
          <h2 className="text-2xl font-bold mb-5 text-center break-words text-black">{headline || '（見出し未登録）'}</h2>
          {/* 問題本文 */}
          <div className="prose prose-sm sm:prose max-w-none whitespace-pre-line text-base leading-relaxed text-black mb-4">{problemBody || '問題がありません。'}</div>
        </div>
      )}

      {/* 解説タブ */}
      {activeTab === 'explanation' && (
        <div>
          {/* コピー */}
          <div className="text-xl font-bold text-center mb-4 text-black break-words">{copyText || '[コピー未登録]'}</div>
          {/* カルーセル */}
          {renderCarousel()}
          {/* 解説本文 */}
          <div className="prose prose-sm sm:prose max-w-none mb-8 whitespace-pre-line text-base leading-relaxed text-black">{explanation || '解説がありません。'}</div>
          {/* 詳細情報 */}
          <div className="text-sm text-black space-y-3 mt-6 border-t pt-6">
            <p><strong>広告主:</strong> {advertiser || '[未登録]'}</p>
            <p><strong>コピーライター:</strong> {copywriter || '[未登録]'}</p>
            <p><strong>年度:</strong> {yearCreated || '[未登録]'}</p>
            <p><strong>受賞:</strong> {awards || '[未登録]'}</p>
            <p><strong>業種:</strong> {Array.isArray(tags) && tags.length > 0 ? tags.join(', ') : '[未登録]'}</p>
            <div>
              <strong>出典:</strong>
              {Array.isArray(source) && source.length > 0 ? (
                <ul className="list-disc list-inside ml-4">
                  {source.map((s, index) => (
                    <li key={index}>
                      <a 
                        href={s.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-indigo-600 hover:text-indigo-800 hover:underline"
                      >
                        {s.title || '（タイトルなし）'} 
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="ml-2">[未登録]</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 