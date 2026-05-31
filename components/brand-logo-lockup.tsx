import type { CSSProperties } from "react";
import { siteConfig } from "@/lib/site";

type BrandLogoLockupProps = {
  orientation?: "horizontal" | "vertical";
  width?: number | string;
  color?: string;
  className?: string;
};

const layoutStyles = {
  horizontal: {
    wrapper: "inline-flex items-center gap-3",
    mark: "w-[30%] flex-none",
    text: "w-[66%] flex-none"
  },
  vertical: {
    wrapper: "inline-flex flex-col items-center gap-0",
    mark: "relative z-10 -mb-[13%] w-[92%] origin-top translate-x-[4%] translate-y-[20%] scale-y-[0.8]",
    text: "relative z-20 w-full"
  }
};

function toCssWidth(width: number | string) {
  return typeof width === "number" ? `${width}px` : width;
}

function logoMaskStyle(src: string, color: string): CSSProperties {
  return {
    backgroundColor: color,
    maskImage: `url(${src})`,
    maskPosition: "center",
    maskRepeat: "no-repeat",
    maskSize: "contain",
    WebkitMaskImage: `url(${src})`,
    WebkitMaskPosition: "center",
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskSize: "contain"
  };
}

export function BrandLogoLockup({ orientation = "horizontal", width = 220, color = "var(--color-espresso)", className = "" }: BrandLogoLockupProps) {
  const layout = layoutStyles[orientation];

  return (
    <span
      className={`${layout.wrapper} ${className}`.trim()}
      style={{ width: toCssWidth(width) }}
      aria-label={siteConfig.name}
      role="img"
    >
      <span
        aria-hidden="true"
        className={`aspect-[210/128] ${layout.mark}`}
        style={logoMaskStyle("/brand/logo-dragonfly.svg", color)}
      />
      <span
        aria-hidden="true"
        className={`aspect-[210/114] ${layout.text}`}
        style={logoMaskStyle("/brand/logo-text.svg", color)}
      />
    </span>
  );
}
