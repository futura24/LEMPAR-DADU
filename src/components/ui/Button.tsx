import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'utama' | 'kedua' | 'lembut' | 'bahaya';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  block?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  utama: 'bg-matahari text-tinta border-matahari-deep hover:bg-matahari-light',
  kedua: 'bg-langit text-white border-langit-deep hover:bg-sky-300 hover:text-tinta',
  lembut: 'bg-white text-tinta border-tinta/25 hover:bg-kertas',
  bahaya: 'bg-stroberi text-white border-stroberi-deep hover:bg-stroberi-light hover:text-tinta',
};

const SIZES: Record<Size, string> = {
  sm: 'px-3 py-2 text-sm gap-1.5',
  md: 'px-5 py-3 text-base gap-2',
  lg: 'px-7 py-4 text-lg sm:text-xl gap-3',
};

export function Button({
  variant = 'utama',
  size = 'md',
  icon,
  block = false,
  className = '',
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        'inline-flex items-center justify-center rounded-2xl border-2 font-display font-semibold',
        'shadow-pop transition-transform duration-100 motion-safe:hover:-translate-y-0.5',
        'active:translate-y-0.5 active:shadow-pop-sm',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-anggur/60',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:translate-y-0',
        VARIANTS[variant],
        SIZES[size],
        block ? 'w-full' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}
