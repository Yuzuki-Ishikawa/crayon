"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Use Next.js Image for optimization
import type { CopyEntryForList } from '@/app/copy/page'; // Use normal quotes

interface CopyListTabsProps {
  copyEntries: CopyEntryForList[];
}

export default function CopyListTabs({ copyEntries }: CopyListTabsProps) {
  const [activeTab, setActiveTab] = useState<'problem' | 'explanation'>('problem');

  const problemTabClasses = activeTab === 'problem'
    ? 'border-indigo-500 text-indigo-600'
    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
  const explanationTabClasses = activeTab === 'explanation'
    ? 'border-indigo-500 text-indigo-600'
    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';

  return (
    <div className="max-w-3xl mx-auto">
      {/* Tab Navigation */}
      <div className="mb-4 border-b border-gray-200">
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

      {/* Problem Tab Content */}
      {activeTab === 'problem' && (
        <div className="space-y-5">
          {copyEntries.map((entry) => (
            <Link key={entry.id} href={`/copy/${entry.id}`} className="block p-5 border rounded-lg shadow-sm hover:shadow-lg transition-shadow bg-white">
              <div className="flex justify-between items-start mb-1.5">
                <h2 className="text-xl font-semibold text-black truncate mr-4" title={entry.headline || ''}>
                  {entry.headline || '（見出しなし）'}
                </h2>
                <span className="text-sm text-gray-600 flex-shrink-0">
                  {entry.advertiser || '（広告主不明）'}
                </span>
              </div>
              <div className="flex justify-between items-end text-sm">
                <span className="text-gray-500">Vol. {entry.serial_number || 'N/A'}</span>
                <span className="text-gray-700">{entry.copywriter || '（作者不明）'}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Explanation Tab Content */}
      {activeTab === 'explanation' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {copyEntries.map((entry) => (
            <Link key={entry.id} href={`/copy/${entry.id}`} className="block border rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow bg-white">
              <div className="relative w-full h-36 bg-gray-200">
                {entry.signedThumbnailUrl ? (
                  <Image
                    src={entry.signedThumbnailUrl}
                    alt={entry.headline || 'Thumbnail'}
                    layout="fill"
                    objectFit="cover"
                    unoptimized={true} // Consider removing if images are internal or configured in next.config.js
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                )}
              </div>
              <div className="p-4">
                <span className="block text-sm text-gray-600 mb-1.5">Vol. {entry.serial_number || 'N/A'}</span>
                <p className="text-base font-medium text-black line-clamp-3" title={entry.copy_text || ''}>
                  {entry.copy_text || '（コピーなし）'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 