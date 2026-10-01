import Image from "next/image";
import Link from "next/link";
import { hardscapeFeatures } from "@/data/services";
import { siteConfig } from "@/data/site";
import { ArrowRight } from "./icons";
import { SectionHeading } from "./SectionHeading";

export function Hardscape() {
  const [lead, ...rest] = hardscapeFeatures;
  return (
    <section id="hardscape" aria-labelledby="hardscape-heading" className="relative bg-navy-950 py-20 text-white md:py-28">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="hardscape-heading"
            tone="dark"
            eyebrow="Hardscapes"
            title="Professional Hardscape Installation"
            intro="Stone and paver work built on proper base preparation, drainage and detailing — so it looks right and stays right."
          />
          <Link data-reveal href={siteConfig.estimateHref} className="link-arrow shrink-0 text-ember-400 md:pb-2">
            Plan your hardscape <ArrowRight width={18} height={18} />
          </Link>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          <li data-reveal className="group relative col-span-2 row-span-2 overflow-hidden rounded-2xl">
            <div className="relative aspect-[4/3] h-full md:aspect-auto">
              <Image src={lead.image} alt={lead.alt} fill sizes="(min-width:768px) 66vw, 100vw" className="object-cover transition-transform duration-[1.4s] group-hover:scale-105" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-transparent to-transparent" />
            <p className="absolute bottom-5 left-5 font-serif text-3xl font-bold md:bottom-7 md:left-7 md:text-4xl">{lead.label}</p>
          </li>
          {rest.map((f, i) => (
            <li
              key={f.label}
              data-reveal
              style={{ ["--reveal-delay" as string]: `${(i + 1) * 70}ms` }}
              className={`group relative overflow-hidden rounded-2xl ${i === rest.length - 1 ? "col-span-2 md:col-span-1" : ""}`}
            >
              <div className={`relative ${i === rest.length - 1 ? "aspect-[2/1] md:aspect-[3/2]" : "aspect-square md:aspect-[3/2]"}`}>
                <Image src={f.image} alt={f.alt} fill sizes="(min-width:768px) 33vw, 50vw" className="object-cover transition-transform duration-[1.4s] group-hover:scale-105" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent" />
              <p className="absolute bottom-3.5 left-4 font-serif text-xl font-bold md:text-2xl">{f.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
