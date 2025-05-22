"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Use Next.js Image for optimization
import type { CopyEntryForList } from '@/app/copy/page'; // Use normal quotes
import { Chip, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, IconButton, Badge } from '@mui/material';
import { FilterList as FilterListIcon, Close as CloseIcon, Image as ImageIcon } from '@mui/icons-material';

interface CopyListTabsProps {
  copyEntries: CopyEntryForList[];
  allIndustryTags: string[];
  allCategoryTags: string[];
}

export default function CopyListTabs({ copyEntries, allIndustryTags, allCategoryTags }: CopyListTabsProps) {
  const [filteredEntries, setFilteredEntries] = useState<CopyEntryForList[]>(copyEntries);
  
  // Modal state
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  // Temporary selections in modal
  const [tempSelectedIndustry, setTempSelectedIndustry] = useState<string>('');
  const [tempSelectedCategory, setTempSelectedCategory] = useState<string>('');

  // Actual applied filters
  const [appliedIndustry, setAppliedIndustry] = useState<string>('');
  const [appliedCategory, setAppliedCategory] = useState<string>('');

  useEffect(() => {
    let currentEntries = copyEntries; 
    if (appliedIndustry) {
      currentEntries = currentEntries.filter(entry => (entry.industry_tags ?? []).includes(appliedIndustry));
    }
    if (appliedCategory) {
      currentEntries = currentEntries.filter(entry => (entry.category_tags ?? []).includes(appliedCategory));
    }
    setFilteredEntries(currentEntries);
  }, [copyEntries, appliedIndustry, appliedCategory]);

  const openFilterModal = () => {
    setTempSelectedIndustry(appliedIndustry);
    setTempSelectedCategory(appliedCategory);
    setIsFilterModalOpen(true);
  };

  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const handleApplyFilters = () => {
    setAppliedIndustry(tempSelectedIndustry);
    setAppliedCategory(tempSelectedCategory);
    closeFilterModal();
  };

  const handleClearFilters = () => {
    setTempSelectedIndustry('');
    setTempSelectedCategory('');
  };
  
  const handleClearAllAppliedFilters = () => {
    setAppliedIndustry('');
    setAppliedCategory('');
    setTempSelectedIndustry('');
    setTempSelectedCategory('');
    // No need to close modal if clearing from outside, but if called from modal, it might be desired
  };

  const activeFilterCount = (appliedIndustry ? 1 : 0) + (appliedCategory ? 1 : 0);

  return (
    <div className="max-w-5xl mx-auto py-3 px-2 sm:px-4">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 px-2">
        {/* Breadcrumbs */}
        <nav aria-label="breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-700 hover:underline">
                トップページ
              </Link>
            </li>
            <li>
              <span className="mx-1">/</span>
            </li>
            <li>
              <span className="font-medium text-gray-700">記事一覧</span>
            </li>
          </ol>
        </nav>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          <IconButton 
            onClick={openFilterModal}
            sx={{ 
              backgroundColor: activeFilterCount > 0 ? '#2253A3' : '#e0e0e0',
              color: activeFilterCount > 0 ? 'white' : '#555',
              '&:hover': {
                backgroundColor: activeFilterCount > 0 ? '#1e478a' : '#d5d5d5'
              },
              padding: '8px'
            }}
            aria-label="filter"
          >
            <Badge badgeContent={activeFilterCount} color="error">
              <FilterListIcon />
            </Badge>
          </IconButton>
          {activeFilterCount > 0 && (
            <span className="text-sm text-gray-600">{activeFilterCount}件のフィルタ適用中</span>
          )}
        </div>
        {activeFilterCount > 0 && (
           <Button onClick={handleClearAllAppliedFilters} size="small" sx={{ color: '#2253A3' }}>
            全てクリア
          </Button>
        )}
      </div>

      <Dialog open={isFilterModalOpen} onClose={closeFilterModal} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 'medium' }}>
          フィルターオプション
          <IconButton
            aria-label="close"
            onClick={closeFilterModal}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">業種タグ</label>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <Chip
                label="すべて"
                onClick={() => setTempSelectedIndustry('')}
                variant={tempSelectedIndustry === '' ? 'filled' : 'outlined'}
                sx={tempSelectedIndustry === '' ? { backgroundColor: '#2253A3', color: 'white', '&:hover': { backgroundColor: '#1e478a'} } : {}}
              />
              {allIndustryTags.map(tag => (
                <Chip
                  key={tag}
                  label={tag}
                  onClick={() => setTempSelectedIndustry(tag)}
                  variant={tempSelectedIndustry === tag ? 'filled' : 'outlined'}
                  sx={tempSelectedIndustry === tag ? { backgroundColor: '#2253A3', color: 'white', '&:hover': { backgroundColor: '#1e478a'} } : {}}
                />
              ))}
            </Stack>
              </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリタグ</label>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <Chip
                label="すべて"
                onClick={() => setTempSelectedCategory('')}
                variant={tempSelectedCategory === '' ? 'filled' : 'outlined'}
                sx={tempSelectedCategory === '' ? { backgroundColor: '#2253A3', color: 'white', '&:hover': { backgroundColor: '#1e478a'} } : {}}
              />
              {allCategoryTags.map(tag => (
                <Chip
                  key={tag}
                  label={tag}
                  onClick={() => setTempSelectedCategory(tag)}
                  variant={tempSelectedCategory === tag ? 'filled' : 'outlined'}
                  sx={tempSelectedCategory === tag ? { backgroundColor: '#2253A3', color: 'white', '&:hover': { backgroundColor: '#1e478a'} } : {}}
                />
              ))}
            </Stack>
        </div>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', padding: '16px 24px'}}>
          <Button onClick={handleClearFilters} sx={{ color: '#2253A3' }}>
            選択をクリア
          </Button>
          <Button onClick={handleApplyFilters} variant="contained" sx={{ backgroundColor: '#2253A3', '&:hover': { backgroundColor: '#1e478a' } }}>
            適用する
          </Button>
        </DialogActions>
      </Dialog>

      {filteredEntries.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
          {filteredEntries.map((entry) => {
            return (
              <Link key={entry.id} href={`/copy/${entry.id}`} className="group block rounded-xl shadow-lg overflow-hidden bg-white hover:shadow-2xl transition-all duration-300 ease-in-out flex flex-col">
                <div className="relative w-full" style={{ aspectRatio: '1.618 / 1' }}>
                {entry.signedThumbnailUrl ? (
                  <Image
                    src={entry.signedThumbnailUrl}
                      alt={entry.headline || 'イメージ'}
                    layout="fill"
                    objectFit="cover"
                      className={`group-hover:scale-105 transition-transform duration-500 ease-in-out opacity-100`}
                  />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 bg-gray-200 w-full" style={{ aspectRatio: '1.618 / 1' }}>
                      <ImageIcon sx={{ fontSize: 60, color: '#cccccc' }} />
                    </div>
                  )}
                </div>
                <div className="p-5 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <span className="block text-base text-gray-800">
                      {`Vol. ${entry.serial_number || '-'}`}
                    </span>
                    {entry.publish_at && (
                      <span className="block text-base text-red-600">
                        {formatListDate(entry.publish_at)}
                      </span>
                )}
              </div>
                  <p className="text-xl font-medium text-gray-800 line-clamp-3 leading-tight mb-3 flex-grow" title={entry.copy_text || ''}>
                    {entry.copy_text || '（タイトル未設定）'}
                  </p>
                  <div className="mt-auto pt-3 border-t border-gray-200">
                    <span className="text-sm text-gray-600">
                      {entry.advertiser || '-'}
                    </span>
                  </div>
              </div>
            </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <FilterListIcon sx={{ fontSize: 60, color: '#cbd5e1' }} />
          <p className="text-2xl font-semibold text-gray-700 mt-6 mb-2">該当する記事はありません</p>
          <p className="text-base text-gray-500">フィルタ条件を変更して再検索してください。</p>
        </div>
      )}
    </div>
  );
} 

function formatListDate(dateStr?: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`;
}