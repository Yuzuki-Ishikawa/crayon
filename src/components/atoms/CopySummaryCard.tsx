'use client'

import React from 'react';
import { Card, CardContent, Typography, CardMedia } from '@mui/material';
import Link from 'next/link';

export type CopySummaryCardProps = {
  id: string;
  title: string;
  // thumbnail?: string; // サムネイル画像URL (将来的に使用)
  type: 'problem' | 'explanation'; // 問題か解説かを示す
};

export default function CopySummaryCard({ id, title, type }: CopySummaryCardProps) {
  // 将来的にはtypeに応じてサムネイルやアイコンを変更することも可能
  const placeholderImage = type === 'problem' 
    ? 'https://via.placeholder.com/300x200/E0E0E0/000000?text=Problem' 
    : 'https://via.placeholder.com/300x200/B2DFDB/000000?text=Explanation';

  return (
    <Link href={`/copy/${id}`} passHref legacyBehavior>
      <Card component="a" sx={{ textDecoration: 'none', width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 11px)'}, mb: 2, '@media (min-width:600px)': { mr: '16px' } }}>
        <CardMedia
          component="img"
          height="140"
          image={placeholderImage} // いずれ thumbnail prop を使用
          alt={title}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {type === 'problem' ? '問題編を見る' : '解説編を見る'}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
} 