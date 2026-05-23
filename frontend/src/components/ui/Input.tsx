import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-2xs font-medium text-textMuted uppercase tracking-label mb-1.5">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`form-field w-full px-3 py-2 text-sm border ${
            error ? 'border-red-500/60' : 'border-border'
          } rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-2xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
