import React from 'react';
import AnswerCard, { AnswerCardProps } from '../atoms/AnswerCard';

export type AnswerListProps = {
  answers: AnswerCardProps[];
};

export default function AnswerList({ answers }: AnswerListProps) {
  return (
    <div>
      {answers.map((answer, idx) => (
        <AnswerCard key={idx} {...answer} />
      ))}
    </div>
  );
} 