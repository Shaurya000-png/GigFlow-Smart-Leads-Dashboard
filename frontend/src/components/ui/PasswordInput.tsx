import React, { forwardRef, useState, useCallback } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, className = '', autoComplete, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const setInputRef = useCallback(
      (node: HTMLInputElement | null) => {
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    return (
      <div className="w-full overflow-visible">
        {label && (
          <label className="block text-2xs font-medium text-textMuted uppercase tracking-label mb-1.5">
            {label}
          </label>
        )}
        <div className="relative overflow-visible">
          <input
            {...props}
            ref={setInputRef}
            autoComplete={autoComplete}
            className={`form-field w-full px-3 py-2 pr-11 text-sm border ${
              error ? 'border-red-500/60' : 'border-border'
            } rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 ${
              showPassword ? 'password-visible' : 'password-hidden'
            } ${className}`}
            type={showPassword ? 'text' : 'password'}
            spellCheck={false}
          />
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowPassword((prev) => !prev);
            }}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-md text-gray-600 hover:text-black hover:bg-gray-100 transition-colors z-20 cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff size={17} strokeWidth={1.75} aria-hidden />
            ) : (
              <Eye size={17} strokeWidth={1.75} aria-hidden />
            )}
          </button>
        </div>
        {error && <p className="mt-1 text-2xs text-red-400">{error}</p>}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
