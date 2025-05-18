import React from 'react';
import ProblemCard, { ProblemCardProps } from '../atoms/ProblemCard';

export type ProblemListProps = {
  problems: ProblemCardProps[];
  onProblemClick?: (index: number) => void;
};

export default function ProblemList({ problems, onProblemClick }: ProblemListProps) {
  return (
    <div>
      {problems.map((problem, idx) => (
        <ProblemCard
          key={idx}
          {...problem}
          onClick={onProblemClick ? () => onProblemClick(idx) : undefined}
        />
      ))}
    </div>
  );
} 