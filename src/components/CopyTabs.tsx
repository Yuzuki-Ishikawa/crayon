"use client";

import React from 'react';
import Link from 'next/link';
import { Chip, Stack } from '@mui/material';

interface CopyTabsProps {
  explanation: string | null;
  copyText: string | null;
  advertiser: string | null;
  copywriter: string | null;
  yearCreated: number | null;
  awards: string | null;
  industry_tags: string[] | null;
  category_tags: string[] | null;
  source: Array<{title: string, url: string}> | null | undefined;
  volNumber?: string | number | null;
  keyVisualUrls?: string[] | null;
  publishAt?: string | null;
}

// Helper function to format date
function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return ''; // Invalid date
  return `${d.getFullYear()}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getDate().toString().padStart(2, '0')}`;
}

export default function CopyTabs({
  explanation,
  copyText,
  advertiser,
  copywriter,
  yearCreated,
  awards,
  industry_tags,
  category_tags,
  source,
  volNumber,
  keyVisualUrls,
  publishAt,
}: CopyTabsProps) {
  // カルーセル（横スクロール）
  const renderCarousel = () => {
    if (!keyVisualUrls || keyVisualUrls.length === 0) {
      return <div className="text-gray-400 text-center py-4">画像がありません</div>;
    }
    return (
      <div className="flex gap-4 overflow-x-auto pb-2 mt-2 mb-4 no-scrollbar">
        {keyVisualUrls.map((url, idx) => {
          return (
            <div key={idx} className="w-64 h-48 relative flex-shrink-0 shadow-md rounded-lg overflow-hidden bg-gray-100">
              {url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt={`key visual ${idx + 1}`} className="object-cover w-full h-full" />
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
    <div className="font-sans">
      {/* Breadcrumbs and Date section */}
      {(volNumber || publishAt) && (
        <div className="flex justify-between items-center mb-6 text-sm">
          {volNumber ? (
            <nav aria-label="breadcrumb">
              <ol className="flex items-center space-x-1 text-gray-500">
                <li>
                  <Link href="/" className="hover:text-gray-700 hover:underline">
                    トップページ
                  </Link>
                </li>
                <li>
                  <span className="mx-1">/</span>
                </li>
                <li>
                  <Link href="/copy" className="hover:text-gray-700 hover:underline">
                    記事一覧
                  </Link>
                </li>
                <li>
                  <span className="mx-1">/</span>
                </li>
                <li>
                  <span className="font-medium text-gray-700">
                    Vol. {volNumber}
                  </span>
                </li>
              </ol>
        </nav>
          ) : <div />}

          {publishAt ? (
            <span className="text-red-600 font-medium">
              {formatDate(publishAt)}
            </span>
          ) : <div />}
        </div>
      )}

      {/* Main content: copy text, carousel, tags, explanation, details */}
        <div>
        {/* Copy Text */}
        <h1 className="text-3xl md:text-4xl font-medium text-center mb-10 text-gray-800 break-words leading-tight hyphens-auto">{copyText || '[コピー未登録]'}</h1>
        
          {/* カルーセル */}
        {(keyVisualUrls && keyVisualUrls.length > 0) && (
          <div className="mb-10">
          {renderCarousel()}
          </div>
        )}

        {/* タグ表示 (カルーセルと解説本文の間) */}
        {( (Array.isArray(industry_tags) && industry_tags.length > 0) || (Array.isArray(category_tags) && category_tags.length > 0) ) && (
          <div className="my-6 flex flex-col gap-3 items-center">
            {Array.isArray(industry_tags) && industry_tags.length > 0 && (
              <div className="flex items-center gap-2">
                <strong className="font-medium text-gray-700 text-sm">業種:</strong>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {industry_tags.map((tag, index) => (
                    <Chip 
                      key={`industry-${index}`} 
                      label={tag} 
                      size="small" 
                      variant="filled"
                      sx={{ backgroundColor: '#e5e7eb', color: '#374151' }} 
                    />
                  ))}
                </Stack>
              </div>
            )}
            {Array.isArray(category_tags) && category_tags.length > 0 && (
              <div className="flex items-center gap-2">
                <strong className="font-medium text-gray-700 text-sm">カテゴリ:</strong>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {category_tags.map((tag, index) => (
                    <Chip 
                      key={`category-${index}`} 
                      label={tag} 
                      size="small" 
                      variant="filled"
                      sx={{ backgroundColor: '#e5e7eb', color: '#374151' }} 
                    />
                  ))}
                </Stack>
              </div>
            )}
          </div>
        )}

          {/* 解説本文 */}
        <div className="prose prose-xl text-[1.05rem] max-w-none mb-16 text-gray-700 leading-loose hyphens-auto">{explanation || '解説がありません。'}</div>

          {/* 詳細情報 */}
        <div className="text-md text-gray-700 space-y-2 mt-16 border-t border-gray-200 pt-12">
          <p><strong className="text-gray-800">広告主:</strong> {advertiser || '-'}</p>
          <p><strong className="text-gray-800">コピーライター:</strong> {copywriter || '-'}</p>
          <p><strong className="text-gray-800">年度:</strong> {yearCreated || '-'}</p>
          <p><strong className="text-gray-800">受賞:</strong> {awards || '-'}</p>
            <div>
            <strong className="text-gray-800">出典:</strong>
              {Array.isArray(source) && source.length > 0 ? (
              <ul className="list-none ml-2 mt-2 space-y-1">
                  {source.map((s, index) => (
                  <li key={index} className="mb-1">
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
    </div>
  );
} 