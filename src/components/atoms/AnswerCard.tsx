import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

export type AnswerCardProps = {
  answer: string;
  userName?: string;
};

export default function AnswerCard({ answer, userName }: AnswerCardProps) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="body1">{answer}</Typography>
        {userName && (
          <Typography variant="caption" color="text.secondary">
            by {userName}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
} 