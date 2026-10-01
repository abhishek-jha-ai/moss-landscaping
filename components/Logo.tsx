import { siteConfig } from "@/data/site";

/**
 * Typographic recreation of the Moss Landscaping wordmark
 * (MOSS over an orange LANDSCAPING bar). Swap for the official
 * vector logo when supplied.
 */
export function Logo({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={`inline-flex flex-col items-stretch leading-none select-none ${className}`} aria-label={siteConfig.legalName} role="img">
      <span
        aria-hidden
        className={`font-serif font-black text-ember-500 tracking-[0.02em] ${compact ? "text-[1.9rem]" : "text-[2.15rem] md:text-[2.5rem]"}`}
        style={{ lineHeight: 0.86 }}
      >
        MOSS
      </span>
      <span
        aria-hidden
        className={`mt-[3px] bg-ember-500 text-center font-sans font-bold text-white ${compact ? "text-[0.5rem] py-[2px] tracking-[0.42em] pl-[0.42em]" : "text-[0.55rem] md:text-[0.62rem] py-[3px] tracking-[0.45em] pl-[0.45em]"}`}
      >
        LANDSCAPING
      </span>
    </span>
  );
}
