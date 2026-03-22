import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /* Use 'on-surface' when the input sits on bg-surface (elevates to bg-elevated)  */
  /* Use 'on-elevated' when the input sits inside a card (uses bg-surface instead) */
  depth?: 'on-surface' | 'on-elevated';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', depth = 'on-surface', ...props }, ref) => {
    const bg = depth === 'on-elevated' ? 'bg-surface' : 'bg-elevated';
    return (
      <input
        ref={ref}
        className={`${bg} border border-border rounded-md px-3 py-2 text-sm text-primary font-body placeholder:text-muted focus:outline-none focus:border-accent-green transition-colors ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
