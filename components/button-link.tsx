import Link from "next/link";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "dark" | "light";
  external?: boolean;
  className?: string;
};

const variants = {
  primary:
    "bg-gold text-espresso shadow-[0_16px_40px_rgba(223,153,49,0.28)] hover:-translate-y-0.5 hover:bg-gold-dark",
  secondary:
    "border border-espresso/18 bg-white/70 text-espresso hover:-translate-y-0.5 hover:border-espresso/35 hover:bg-white",
  dark:
    "bg-espresso text-cream shadow-[0_18px_42px_rgba(54,36,25,0.28)] hover:-translate-y-0.5 hover:bg-espresso-dark",
  light:
    "bg-white text-espresso shadow-[0_16px_34px_rgba(54,36,25,0.14)] hover:-translate-y-0.5"
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  external = false,
  className = ""
}: ButtonLinkProps) {
  const sharedClass = `inline-flex min-h-12 items-center justify-center rounded-full px-5 text-sm font-bold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rust ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a className={sharedClass} href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link className={sharedClass} href={href}>
      {children}
    </Link>
  );
}

