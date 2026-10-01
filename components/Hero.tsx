import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/data/site";
import { ArrowRight, Play } from "./icons";
import { TrustBar } from "./TrustBar";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-heading" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-navy-950 max-md:pb-[4.6rem]">
      <div className="hero-zoom absolute inset-0 -z-10">
        <Image
          src="/images/poolside-terrace-dusk.jpg"
          alt="Lit pool terrace at dusk with stone spillways, fire lounge, outdoor kitchen pavilion and layered planting"
          fill
          preload
          fetchPriority="high"
          quality={80}
          sizes="100vw"
          className="object-cover object-[64%_50%] md:object-center"
        />
      </div>
      {/* legibility overlays: left-weighted on desktop, bottom-weighted on mobile */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-navy-950/45 to-navy-950/30 md:bg-gradient-to-r md:from-navy-950/90 md:via-navy-950/45 md:to-transparent" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-navy-950/80 to-transparent" />

      <div className="container-x flex flex-1 flex-col justify-end pb-8 pt-28 md:justify-center md:pb-16 md:pt-36">
        <div className="max-w-[40rem]">
          <p className="hero-rise eyebrow mb-5 flex items-center gap-3 !text-[0.66rem] !tracking-[0.18em] text-ember-400 sm:!text-xs sm:!tracking-[0.22em]" style={{ ["--d" as string]: "80ms" }}>
            <span className="hidden h-px w-8 bg-ember-400 sm:block" />
            Landscape Design · Hardscapes · Outdoor Living
          </p>
          <h1 id="hero-heading" className="font-serif text-white">
            <span className="hero-rise block text-[clamp(1.9rem,8.4vw,2.65rem)] font-bold uppercase leading-[1] tracking-[0.03em] sm:text-6xl sm:tracking-[0.04em] lg:text-[4.6rem]" style={{ ["--d" as string]: "160ms" }}>
              Extraordinary
            </span>
            <span className="hero-rise block text-[2.65rem] italic font-semibold leading-[1.08] text-ember-400 sm:text-6xl lg:text-[4.6rem]" style={{ ["--d" as string]: "260ms" }}>
              Outdoor Living
            </span>
            <span className="hero-rise block text-[2.65rem] font-bold leading-[1.08] sm:text-6xl lg:text-[4.6rem]" style={{ ["--d" as string]: "360ms" }}>
              Built to Last
            </span>
          </h1>
          <p className="hero-rise mt-6 max-w-[32rem] text-[1.05rem] leading-relaxed text-white/85 md:text-lg" style={{ ["--d" as string]: "460ms" }}>
            Custom landscape design, hardscapes, and outdoor living spaces for residential and commercial properties across {siteConfig.region}.
          </p>
          <div className="hero-rise mt-8 flex flex-col gap-3 sm:flex-row" style={{ ["--d" as string]: "560ms" }}>
            <Link href={siteConfig.estimateHref} className="btn btn-primary">
              Get a Free Estimate <ArrowRight width={18} height={18} />
            </Link>
            <Link href="/#gallery" className="btn btn-ghost-light">
              View Our Work <Play width={20} height={20} />
            </Link>
          </div>
        </div>
      </div>

      {siteConfig.conceptMode && (
        <p className="hero-rise container-x pb-3 text-right text-[0.68rem] font-medium tracking-[0.12em] text-white/45" style={{ ["--d" as string]: "900ms" }}>
          {siteConfig.conceptLabel}
        </p>
      )}
      <TrustBar />
    </section>
  );
}
