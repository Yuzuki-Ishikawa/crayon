"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import LatestArticlesCarousel from '@/components/LatestArticlesCarousel';
import type { ArticleForLp } from '@/app/page'; // 型定義をインポート
import { Image as ImageIcon } from '@mui/icons-material'; // For placeholder

interface LpClientContentProps {
  featuredArticle: ArticleForLp | null;
  latestArticles: ArticleForLp[];
}

// Helper function from CopyListTabs (or define a shared one later)
function formatListDate(dateStr?: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`;
}

export default function LpClientContent({ featuredArticle, latestArticles }: LpClientContentProps) {

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        pt: { xs: 4, md: 6 }, 
        pb: 6,
        pr: { md: '10%' } // PC表示時に右側に大きなパディングを追加し、コンテンツ全体を左に寄せる
      }}
    >
        <Box 
          display="flex" 
          flexDirection={{ xs: 'column', md: 'row' }} 
          gap={{ xs: 4, md: 3 }} // Adjust gap as needed, this is the space between text and card
          alignItems={{ xs: 'center', md: 'stretch' }} // md: 'stretch' ensures columns are same height if needed
          mb={{xs: 5, md: 6}}
        >
          {/* Left Column (Title/Headline) */}
          <Box 
            sx={{ 
              order: { xs: 1, md: 1 },
              flexGrow: { md: 1 }, // Left column takes up available space
              flexShrink: { md: 1 },
              flexBasis: {md: '0%'}, // Start from 0 and grow
              textAlign: { xs: 'center', md: 'left' },
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', // Vertically center content in this column
              gap: {xs: 1, md: 1.5}
            }}
          >
            <Typography 
              variant="subtitle1"
              component="h2"
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '0.9rem', md: '1.1rem' }, 
                color: 'primary.main',
                lineHeight: 1.4,
              }}
            >
              まいにち広告部 #{featuredArticle?.serial_number || '-'}
            </Typography>
            <Typography 
              variant="h5"
              component="h1"
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '1.2rem', md: '1.7rem' }, 
                color: 'primary.main',
                mb: 0.5 
              }}
            >
              {featuredArticle?.headline || '今日の注目コピー'}
            </Typography>
          </Box>

          {/* Right Column (Featured Article Card) */}
          <Box 
            sx={{
              order: { xs: 2, md: 2 },
              flexGrow: { md: 0 },     // Card column does not grow
              flexShrink: { md: 0 },    // Card column does not shrink
              flexBasis: { md: 'auto' }, // Card column width is determined by its content
              width: { xs: '90%', sm: '80%', md: 380 }, // Explicit width for md, fallback for xs/sm
              maxWidth: { md: 380 }, // Ensure it doesn't exceed this on md
              // On xs/sm, the parent Box alignItems:center and this Box's auto margins (default) should center it.
              // For md, flex-start alignment (default for parent Box) and this explicit width should place it correctly.
            }}
          >
            {featuredArticle ? (
              <Link href={`/copy/${featuredArticle.id}`} className="group block w-full h-full rounded-xl shadow-lg overflow-hidden bg-white hover:shadow-2xl transition-all duration-300 ease-in-out flex flex-col">
                <div className="relative w-full" style={{ aspectRatio: '1.618 / 1' }}>
                {featuredArticle.signedThumbnailUrl ? (
                  <Image
                    src={featuredArticle.signedThumbnailUrl}
                    alt={featuredArticle.headline || '特集記事'}
                    layout="fill"
                    objectFit="cover"
                    className={`group-hover:scale-105 transition-transform duration-500 ease-in-out opacity-100`}
                    priority
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
                      {`Vol. ${featuredArticle?.serial_number || '-'}`}
                    </span>
                    {featuredArticle?.publish_at && (
                      <span className="block text-base text-red-600">
                        {formatListDate(featuredArticle.publish_at)}
                      </span>
                    )}
                  </div>
                  <p className="text-xl font-medium text-gray-800 line-clamp-3 leading-tight mb-3 flex-grow" title={featuredArticle?.copy_text || ''}>
                    {featuredArticle?.copy_text || '（タイトル未設定）'}
                  </p>
                  <div className="mt-auto pt-3 border-t border-gray-200">
                    <span className="text-sm text-gray-600">
                      {featuredArticle?.advertiser || '-'}
                    </span>
                  </div>
                </div>
              </Link>
            ) : (
              <Box sx={{width: '100%', height: {xs: 200, md: 250} /* Placeholder height */, maxWidth: 380, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100', borderRadius: '10px', boxShadow: 1}}>
                <Typography>注目の記事はありません</Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* LINE Button Section - Center aligned */}
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'center',
          my: {xs: 4, md: 5}, 
          order: { xs: 3 },
          width: '100%' // Ensure the Box takes full available width within the padded Container
        }}>
          <Button 
            variant="contained" 
            href="https://line.me/R/ti/p/@931hsabv"
            target="_blank" // Open in new tab
            rel="noopener noreferrer" // Security best practice for target="_blank"
            sx={{ bgcolor: '#06C755', color: '#fff', fontSize: { xs: 13, md: 14 }, fontWeight: 'bold', py: 1.2, px: 3, borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', '&:hover': { bgcolor: '#05a544' }, width: 'auto', whiteSpace: 'nowrap' }}>
            LINE連携で最新情報を受け取る
          </Button>
        </Box>
        {latestArticles && latestArticles.length > 0 && (
          <Box sx={{ order: { xs: 4 }, mt: {xs: 4, md: 5} }} > 
            <Stack direction="row" alignItems="center" spacing={1.5} mb={2.5}>
              <Box sx={{ width: 5, height: 20, bgcolor: 'primary.main', borderRadius: '2px' }} />
              <Typography variant="h6" fontWeight="bold" sx={{ fontSize: {xs: '1.1rem', md: '1.25rem'} }}>最新記事</Typography>
            </Stack>
            <LatestArticlesCarousel articles={latestArticles} />
          </Box>
        )}
    </Container>
  );
} 