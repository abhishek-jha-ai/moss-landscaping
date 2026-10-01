"use client";

import Image from "next/image";
import { services, supportingServices } from "@/data/services";
import { trackEvent } from "@/lib/analytics";
import { emit, requestEstimate, scrollToId } from "@/lib/events";
import { ArrowRight, Leaf, Light, Path, Shears } from "./icons";
import { SectionHeading } from "./SectionHeading";

const supportIcons = { leaf: Leaf, shears: Shears, path: Path, light: Light };

export function Services() {
  return (
    <section id="services" aria-labelledby="services-heading" className="relative bg-ivory-100 py-20 md:py-28">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="services-heading" eyebrow="Our Services" title={<>Transforming<br className="hidden sm:block" /> Outdoor Spaces</>} />
          <p data-reveal className="max-w-md text-[1.05rem] leading-relaxed text-mist md:pb-2">
            From timeless landscape design to hardscapes and outdoor living features — planned, built and maintained by one team.
          </p>
        </div>

        <ul className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-3">
          {services.map((s, i) => (
            <li
              key={s.id}
              data-reveal
              style={{ ["--reveal-delay" as string]: `${(i % 3) * 90}ms` }}
              className="w-[80%] shrink-0 snap-start sm:w-[55%] md:w-auto"
            >
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-navy-950 text-white shadow-[0_24px_50px_-28px_rgba(10,18,25,0.55)]">
                <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/6]">
                  <Image
                    src={s.image}
                    alt={s.imageAlt}
                    fill
                    sizes="(min-width:1024px) 30vw, (min-width:768px) 45vw, 80vw"
                    className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/35 to-transparent" />
                  <span className="absolute left-5 top-5 font-serif text-sm text-white/70">0{i + 1}</span>
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                    <h3 className="font-serif text-[1.6rem] font-bold leading-tight">{s.title}</h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-white/80">{s.summary}</p>
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {s.points.map((p) => (
                        <li key={p} className="rounded-full border border-white/20 px-2.5 py-1 text-[0.72rem] font-semibold text-white/85">
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="grid grid-cols-2 border-t border-white/10 text-sm font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      trackEvent("service_selected", { service: s.id, action: "view_projects" });
                      emit("moss:gallery-filter", s.galleryCategory);
                      scrollToId("gallery");
                    }}
                    className="whitespace-nowrap px-4 py-4 text-left text-white/85 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    See projects
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      trackEvent("service_selected", { service: s.id, action: "request_estimate" });
                      requestEstimate({ projectType: s.estimateType });
                    }}
                    className="flex items-center justify-end gap-2 whitespace-nowrap border-l border-white/10 px-4 py-4 text-ember-400 transition-colors hover:bg-ember-500 hover:text-navy-950"
                    aria-label={`Get an estimate for ${s.title}`}
                  >
                    Get estimate <ArrowRight width={16} height={16} />
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <div data-reveal className="mt-10 flex flex-col gap-4 rounded-2xl border border-ivory-300 bg-ivory-50 p-5 md:flex-row md:items-center md:justify-between md:p-6">
          <p className="font-serif text-xl text-navy-900">Also offering</p>
          <ul className="grid grid-cols-2 gap-3 md:flex md:gap-8">
            {supportingServices.map((s) => {
              const Icon = supportIcons[s.icon];
              return (
                <li key={s.id} className="flex items-center gap-2.5 text-sm font-semibold text-navy-800">
                  <Icon className="text-forest-500" width={18} height={18} />
                  {s.label}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
