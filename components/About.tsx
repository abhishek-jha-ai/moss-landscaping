import Image from "next/image";
import { siteConfig } from "@/data/site";
import { SectionHeading } from "./SectionHeading";

const disciplines = ["Landscape design", "Installation", "Hardscaping", "Outdoor living", "Maintenance"];

export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="bg-ivory-100 py-20 md:py-28">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div className="order-2 lg:order-1">
          <SectionHeading
            id="about-heading"
            eyebrow="About Moss"
            title="Landscaping Built on Experience"
            intro={`For more than ${siteConfig.yearsInBusiness} years, ${siteConfig.name} has provided landscape design, installation, hardscaping, outdoor living, and maintenance services for residential and commercial properties across ${siteConfig.region}.`}
          />
          <p data-reveal className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-mist">
            One team carries a project from the first conversation through design, construction and ongoing care — so the finished space looks the way it was
            planned, season after season.
          </p>
          <ul data-reveal className="mt-8 flex flex-wrap gap-2">
            {disciplines.map((d) => (
              <li key={d} className="rounded-full border border-ivory-300 bg-ivory-50 px-4 py-2 text-sm font-semibold text-navy-800">
                {d}
              </li>
            ))}
          </ul>
        </div>

        <div data-reveal className="relative order-1 lg:order-2">
          <div className="relative aspect-[5/4] overflow-hidden rounded-2xl shadow-[0_40px_80px_-40px_rgba(10,18,25,0.6)]">
            <Image
              src="/images/sunset-pool-waterfall.jpg"
              alt="Freeform pool with natural stone waterfall and lit patio at sunset"
              fill
              sizes="(min-width:1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 left-4 flex items-center gap-4 rounded-2xl bg-navy-900 px-5 py-4 text-white shadow-2xl md:-left-8 md:px-7 md:py-6">
            <span className="font-serif text-5xl font-bold text-ember-400 md:text-6xl">{siteConfig.yearsInBusiness}+</span>
            <span className="text-sm font-semibold leading-snug text-white/85">
              Years of landscaping
              <br /> in New Jersey
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
