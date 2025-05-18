import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

export type ProblemCardProps = {
  title: string;
  summary: string;
  onClick?: () => void;
};

export default function ProblemCard({ title, summary, onClick }: ProblemCardProps) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {summary}
        </Typography>
        {onClick && <Button variant="outlined" onClick={onClick}>詳細</Button>}
      </CardContent>
    </Card>
  );
} 