import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';
import { AnimatedText } from './AnimatedText';

interface EmptyStateProps {
  title: string;
  description: string;
  showCTA?: boolean;
  onCTA?: () => void;
  ctaLabel?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  showCTA = false,
  onCTA,
  ctaLabel,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <div className="mb-3 text-textMuted/60">
        <Inbox size={36} strokeWidth={1.25} />
      </div>
      <AnimatedText as="h3" animation="text-reveal" className="text-sm font-semibold text-premium mb-1">
        {title}
      </AnimatedText>
      <AnimatedText as="p" delay={80} className="text-premium-muted mb-5 max-w-xs">
        {description}
      </AnimatedText>
      {showCTA && onCTA && ctaLabel && (
        <Button onClick={onCTA} variant="secondary">
          {ctaLabel}
        </Button>
      )}
    </div>
  );
};
