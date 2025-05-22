"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Box, Card, CardContent, Typography, IconButton, Stack } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import type { ArticleForLp } from '@/app/page'; // src/app/page.tsx で定義した型をインポート

interface LatestArticlesCarouselProps {
  articles: ArticleForLp[];
}

export default function LatestArticlesCarousel({ articles }: LatestArticlesCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;
    // カードのおおよその幅 + gap を考慮してスクロール量を決定
    const cardWidth = 280; // 下記CardのminWidthと合わせる
    const gap = 16; // 下記Boxのgapと合わせる (theme.spacing(2))
    const scrollAmount = cardWidth + gap;
    container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  // 日付フォーマット関数 (src/app/page.tsx から流用)
  const formatDate = (dateStr?: string | null): string => {
    if (!dateStr) return '日付不明';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '日付不明';
    return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`;
  };

  if (!articles || articles.length === 0) {
    return <Typography sx={{ textAlign: 'center', my: 4 }}>最新記事はありません。</Typography>;
  }

  return (
    <Box position="relative">
      <IconButton
        onClick={() => scroll('left')}
        sx={{
          position: 'absolute',
          left: { xs: -16, sm: -32, md: -48 }, // 画面幅に応じて調整
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          bgcolor: 'rgba(34, 83, 163, 0.8)', // #2253A3 の透過色
          color: 'white',
          '&:hover': { bgcolor: '#2253A3' },
          // 記事が少ない場合は矢印を隠すか、無効化するロジックも検討可
        }}
        aria-label="前の記事へ"
      >
        <ArrowBackIosNewIcon fontSize="small" />
      </IconButton>
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: 2, // theme.spacing(2)
          py: 1, // 上下のpadding
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': { display: 'none' }, // スクロールバー非表示 (Chrome, Safari)
          scrollbarWidth: 'none', // スクロールバー非表示 (Firefox)
          '-ms-overflow-style': 'none', // スクロールバー非表示 (IE, Edge)
        }}
      >
        {articles.map((article) => (
          <Card 
            key={article.id} 
            sx={{ 
              minWidth: { xs: 260, sm: 280 }, // レスポンシブなカード幅
              maxWidth: { xs: 260, sm: 280 },
              flex: '0 0 auto',
              boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
              borderRadius: '10px',
              overflow: 'hidden',
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
              }
            }}
          >
            <Link href={`/copy/${article.id}`} passHref style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              {article.signedThumbnailUrl ? (
                <Image
                  src={article.signedThumbnailUrl}
                  alt={article.headline || '記事サムネイル'}
                  width={280} // カード幅に合わせる
                  height={160} // アスペクト比 16:9 程度
                  style={{ width: '100%', height: 'auto', objectFit: 'cover', aspectRatio: '16/10' }} // 少し縦長も許容
                />
              ) : (
                <Box sx={{ width: '100%', aspectRatio: '16/10', bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary" fontSize="small">画像なし</Typography>
                </Box>
              )}
              <CardContent sx={{ p: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} mb={0.5}>
                  <Typography variant="caption" color="text.secondary">Vol. {article.serial_number || 'N/A'}</Typography>
                  <Typography variant="caption" color="text.secondary">{formatDate(article.publish_at)}</Typography>
                </Stack>
                <Typography 
                  variant="subtitle1" // 少し小さめの見出し
                  component="h3" 
                  fontWeight="medium" 
                  title={article.copy_text || ''}
                  sx={{ 
                    mb: 0.5, 
                    height: '3.6em', // 2行分程度を確保
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    display: '-webkit-box', 
                    WebkitLineClamp: 2, 
                    WebkitBoxOrient: 'vertical',
                    lineHeight: '1.4em' // line-height調整
                  }}
                >
                  {article.copy_text || 'タイトルなし'}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', display: 'block'}}>
                  広告主: {article.advertiser || 'N/A'}
                </Typography>
              </CardContent>
            </Link>
          </Card>
        ))}
      </Box>
      <IconButton
        onClick={() => scroll('right')}
        sx={{
          position: 'absolute',
          right: { xs: -16, sm: -32, md: -48 },
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          bgcolor: 'rgba(34, 83, 163, 0.8)',
          color: 'white',
          '&:hover': { bgcolor: '#2253A3' },
        }}
        aria-label="次の記事へ"
      >
        <ArrowForwardIosIcon fontSize="small" />
      </IconButton>
    </Box>
  );
} 