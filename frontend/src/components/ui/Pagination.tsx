import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, totalPages, totalItems, onPageChange 
}) => {
  if (totalPages <= 1 && totalItems === 0) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-surface border-t border-border sm:px-6 mt-4 rounded-xl">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-textMuted">
            Showing <span className="font-medium text-textMain">{totalItems > 0 ? 1 : 0}</span> to <span className="font-medium text-textMain">{totalItems}</span> results
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <Button
              variant="secondary"
              className="rounded-r-none px-2 py-2"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </Button>
            <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-textMain border border-border bg-surface">
              Page {currentPage} of {Math.max(totalPages, 1)}
            </span>
            <Button
              variant="secondary"
              className="rounded-l-none px-2 py-2"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
};
