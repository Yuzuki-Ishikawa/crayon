'use client'

import React from 'react';
import { Box, Chip, Typography } from '@mui/material';

export interface TagListProps {
  tags: string[];
  heading?: string; // オプションで見出しを表示
}

export default function TagList({ tags, heading }: TagListProps) {
  return (
    <Box>
      {heading && <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>{heading}</Typography>}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {tags && tags.length > 0 ? (
          tags.map((tag, index) => (
            <Chip label={tag} key={index} size="small" />
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            タグはありません。
          </Typography>
        )}
      </Box>
    </Box>
  );
} 