import { Link } from "@tanstack/react-router";
import logoIcon from "@/assets/logo/logo2.png";
import { cn } from "@/lib/utils";

type BrandLockupProps = {
  compact?: boolean;
  className?: string;
};

export function BrandLockup({ compact = false, className }: BrandLockupProps) {
  return (
    <Link
      to="/"
      aria-label="The Nuzz Story"
      className={cn("flex min-w-0 items-center gap-2", className)}
    >
      <img
        src={logoIcon}
        alt=""
        className={cn("w-auto shrink-0 object-contain", compact ? "h-8" : "h-11 xl:h-12")}
      />
      <span className="min-w-0 leading-none">
        <span
          className={cn(
            "block whitespace-nowrap font-[family-name:var(--font-wordmark)] font-bold uppercase tracking-[0.04em] text-[#c79236]",
            compact ? "text-[18px] sm:text-[20px]" : "text-lg xl:text-xl",
          )}
        >
          The Nuzz Story
        </span>
        {!compact && (
          <span className="mt-1 flex items-center gap-1.5 text-[9px] font-[family-name:var(--font-wordmark)] font-semibold uppercase tracking-[0.12em] text-[#c79236] xl:text-[10px]">
            <span className="h-px w-3 shrink-0 bg-[#c79236] sm:w-4" aria-hidden />
            Pet Retail &amp; Spa
            <span className="h-px w-3 shrink-0 bg-[#c79236] sm:w-4" aria-hidden />
          </span>
        )}
      </span>
    </Link>
  );
}
