"use client";

import Image from "next/image";
import { outdoorLivingFeatures } from "@/data/services";
import { emit, scrollToId } from "@/lib/events";
import { trackEvent } from "@/lib/analytics";
import { ArrowRight } from "./icons";
import { SectionHeading } from "./SectionHeading";

export function OutdoorLiving() {
  return (
    <section id="outdoor-living" aria-labelledby="outdoor-living-heading" className="relative overflow-hidden bg-ivory-50 py-20 md:py-28">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        {/* image composition */}
        <div data-reveal className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_40px_80px_-40px_rgba(10,18,25,0.6)]">
            <Image
              src="/images/outdoor-kitchen-dining.jpg"
              alt="Covered stone outdoor kitchen with bar seating and a dining table beside a pool"
              fill
              sizes="(min-width:1024px) 55vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-8 right-4 hidden w-[42%] overflow-hidden rounded-xl border-[6px] border-ivory-50 shadow-2xl sm:block md:-right-6">
            <div className="relative aspect-[4/3]">
              <Image src="/images/detail-round-firepit.jpg" alt="Round stone fire pit surrounded by lounge chairs" fill sizes="25vw" className="object-cover" />
            </div>
          </div>
          <div className="absolute -top-5 left-5 rounded-full bg-navy-900 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-ember-400 shadow-lg">
            Kitchens · Fire · Lounge · Light
          </div>
        </div>

        <div>
          <SectionHeading
            id="outdoor-living-heading"
            eyebrow="Outdoor Living"
            title="Outdoor Living Designed Around the Way You Live"
            intro="Cooking, dining, gathering around the fire, or a quiet evening by the pool — we design each space around how you'll actually use it, then build it to last."
          />
          <ul className="mt-9 grid grid-cols-2 gap-x-6 gap-y-6">
            {outdoorLivingFeatures.map((f, i) => (
              <li key={f.label} data-reveal style={{ ["--reveal-delay" as string]: `${i * 60}ms` }} className="border-t border-ivory-300 pt-4">
                <p className="font-serif text-lg font-bold text-navy-900">{f.label}</p>
                <p className="mt-1 text-sm leading-relaxed text-mist">{f.detail}</p>
              </li>
            ))}
          </ul>
          <button
            type="button"
            data-reveal
            onClick={() => {
              trackEvent("service_selected", { service: "outdoor-living", action: "explore" });
              emit("moss:gallery-filter", "outdoor-living");
              scrollToId("gallery");
            }}
            className="btn btn-dark mt-10"
          >
            Explore Outdoor Living <ArrowRight width={18} height={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
