"use client";

import Image from "next/image";
import { audienceSplit } from "@/data/services";
import { requestEstimate } from "@/lib/events";
import { trackEvent } from "@/lib/analytics";
import { ArrowRight, Building, Check, Home } from "./icons";
import { SectionHeading } from "./SectionHeading";

const cards = [
  { key: "residential", data: audienceSplit.residential, Icon: Home, property: "residential" },
  { key: "commercial", data: audienceSplit.commercial, Icon: Building, property: "commercial" },
] as const;

export function ResidentialCommercial() {
  return (
    <section id="residential-commercial" aria-labelledby="rc-heading" className="bg-ivory-50 py-20 md:py-28">
      <div className="container-x">
        <SectionHeading
          id="rc-heading"
          align="center"
          eyebrow="Residential & Commercial"
          title="One Team for Every Property"
          intro="Whether it's your backyard or a property you manage, we bring the same design sense and build quality."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 md:gap-6">
          {cards.map(({ key, data, Icon, property }, i) => (
            <article
              key={key}
              data-reveal
              style={{ ["--reveal-delay" as string]: `${i * 100}ms` }}
              className="group relative isolate flex min-h-[30rem] flex-col justify-end overflow-hidden rounded-3xl p-6 text-white md:min-h-[34rem] md:p-9"
            >
              <Image src={data.image} alt={data.imageAlt} fill sizes="(min-width:768px) 50vw, 100vw" className="-z-10 object-cover transition-transform duration-[1.6s] group-hover:scale-105" />
              <div className={`absolute inset-0 -z-10 bg-gradient-to-t ${key === "residential" ? "from-navy-950 via-navy-950/70" : "from-forest-950 via-forest-950/75"} to-transparent`} />
              <span className="mb-auto grid size-12 place-items-center rounded-full border border-white/25 bg-white/10 text-ember-400 backdrop-blur">
                <Icon width={22} height={22} />
              </span>
              <h3 className="mt-10 font-serif text-4xl font-bold">{data.title}</h3>
              <ul className="mt-5 grid gap-x-4 gap-y-2.5 min-[420px]:grid-cols-2">
                {data.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[0.95rem] font-semibold text-white/90">
                    <Check width={16} height={16} className="shrink-0 text-ember-400" /> {item}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => {
                  trackEvent("service_selected", { service: key, action: "discuss_property" });
                  requestEstimate({ propertyType: property, ...(key === "commercial" ? { projectType: "commercial" as const } : {}) });
                }}
                className="btn btn-primary mt-8 self-start"
              >
                Discuss Your Property <ArrowRight width={18} height={18} />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
