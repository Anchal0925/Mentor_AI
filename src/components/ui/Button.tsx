import React from 'react';

type ButtonVariant = 'primary' | 'ghost-green' | 'ghost-neutral' | 'full-action' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center transition-all duration-150 focus:outline-none active:scale-[0.98]';

  const variants: Record<ButtonVariant, string> = {
    'primary':       'bg-accent-green text-black font-display font-semibold rounded-md px-5 py-2.5 hover:brightness-110',
    'ghost-green':   'bg-transparent border border-accent-green text-accent-green rounded-md px-5 py-2.5 hover:bg-accent-green-bg',
    'ghost-neutral': 'bg-transparent border border-border text-secondary rounded-md px-5 py-2.5 hover:border-border-hover hover:text-primary',
    'full-action':   'w-full bg-transparent border border-border text-primary font-body text-sm h-10 rounded-md hover:border-border-hover hover:bg-white/[0.03]',
    'danger':        'bg-accent-red/10 border border-accent-red/40 text-accent-red rounded-md px-5 py-2.5 hover:bg-accent-red/15',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
