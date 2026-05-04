'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

const variants = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 dark:shadow-indigo-900/40',
  secondary: 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700',
  ghost: 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-200 dark:shadow-red-900/40',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        </span>
      )}
      <span className={cn('flex items-center gap-2', loading && 'invisible')}>{children}</span>
    </motion.button>
  );
}
