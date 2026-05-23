import React from 'react';

type AnimationVariant = 'fade-in' | 'fade-in-up' | 'text-reveal';

interface AnimatedTextProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  delay?: number;
  className?: string;
  animation?: AnimationVariant;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  as: Tag = 'p',
  delay = 0,
  className = '',
  animation = 'fade-in-up',
}) => {
  const animationClass =
    animation === 'text-reveal'
      ? 'animate-text-reveal'
      : animation === 'fade-in'
        ? 'animate-fade-in'
        : 'animate-fade-in-up';

  return (
    <Tag
      className={`${animationClass} ${className}`}
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
};
