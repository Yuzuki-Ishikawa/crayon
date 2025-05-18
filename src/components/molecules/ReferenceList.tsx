'use client'

import React from 'react';
import { List, ListItem, ListItemText, Typography, Link as MuiLink, Box } from '@mui/material';

export interface ReferenceItem {
  type: string;
  value: string;
  text: string;
}

export interface ReferenceListProps {
  references: ReferenceItem[];
  heading?: string; // オプションで見出しを表示
}

export default function ReferenceList({ references, heading }: ReferenceListProps) {
  return (
    <Box>
      {heading && <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>{heading}</Typography>}
      {references && references.length > 0 ? (
        <List dense>
          {references.map((ref, index) => (
            <ListItem key={index} sx={{ alignItems: 'flex-start' }}>
              <ListItemText 
                primary={ref.text}
                secondary={ref.type === 'URL' 
                  ? <MuiLink href={ref.value} target="_blank" rel="noopener" variant="body2">{ref.value}</MuiLink> 
                  : <Typography variant="body2" color="text.secondary">{ref.value}</Typography>}
                primaryTypographyProps={{ fontWeight: 'medium' }}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary">
          参考文献はありません。
        </Typography>
      )}
    </Box>
  );
} 