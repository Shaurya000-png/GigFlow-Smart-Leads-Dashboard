import React from 'react';
import { Button } from '../ui/Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  total: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  total,
}) => {
  if (totalPages <= 1 && total === 0) return null;

  return (
    <div className="flex flex-col items-center justify-center p-3.5 mt-4 surface-card gap-2 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="text-2xs font-medium text-textMuted tracking-wide">
          Page {currentPage} of {Math.max(totalPages, 1)}
        </span>
        <Button
          variant="secondary"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </Button>
      </div>
      <p className="text-2xs text-textMuted tracking-wide">{total} total results</p>
    </div>
  );
};
