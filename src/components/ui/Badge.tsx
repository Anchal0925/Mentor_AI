import React from 'react';

type BadgeVariant = 'HOT' | 'NEW' | 'FREE' | 'PRO' | 'RECOMMENDED' | 'TOPIC';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

export function Badge({ variant, children, isActive = false, onClick }: BadgeProps) {
  /* All metadata badges: font-mono, 10px, uppercase, tracking-wider */
  const baseStyles = 'inline-flex items-center justify-center whitespace-nowrap rounded font-mono text-[10px] uppercase tracking-wider px-2 py-0.5';

  const variants: Record<BadgeVariant, string> = {
    'HOT':         'bg-accent-red/15 text-accent-red border border-accent-red/30',
    'NEW':         'bg-accent-teal/15 text-accent-teal border border-accent-teal/30',
    'FREE':        'bg-accent-green/15 text-accent-green border border-accent-green/30',
    'PRO':         'bg-accent-blue/15 text-accent-blue border border-accent-blue/30',
    'RECOMMENDED': 'bg-accent-green/10 text-accent-green border border-accent-green/30',
    'TOPIC': isActive
      ? 'bg-accent-green text-black border-none px-3 py-1 text-[11px] normal-case cursor-pointer font-body font-medium'
      : 'bg-tag-bg border border-tag-border text-secondary px-3 py-1 text-[11px] font-body normal-case cursor-pointer hover:border-accent-green hover:text-accent-green transition-colors',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]}`} onClick={onClick}>
      {children}
    </span>
  );
}
