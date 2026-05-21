import Link from "next/link";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-forest text-white hover:bg-forest/90 border border-forest shadow-sm",
  secondary:
    "bg-sage text-white hover:bg-sage/90 border border-sage shadow-sm",
  outline:
    "bg-white text-forest border border-forest/20 hover:border-forest/40 hover:bg-white",
  ghost: "bg-transparent text-forest hover:bg-forest/5 border border-transparent",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

type Props = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  loading?: boolean;
  href?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  loading,
  href,
  disabled,
  type = "button",
  ...props
}: Props) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`;

  const content = loading ? (
    <>
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      <span>Please wait…</span>
    </>
  ) : (
    children
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled || loading} {...props}>
      {content}
    </button>
  );
}
