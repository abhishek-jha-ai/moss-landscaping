"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { categoryLabels, projectFilters, projects, type Project, type ProjectCategory } from "@/data/projects";
import { siteConfig } from "@/data/site";
import { trackEvent } from "@/lib/analytics";
import { on, requestEstimate } from "@/lib/events";
import { ArrowRight, Expand } from "./icons";
import { SectionHeading } from "./SectionHeading";
import { ProjectLightbox } from "./ProjectLightbox";

type Filter = "all" | ProjectCategory;

/**
 * "All" uses the curated sizes from data; filtered views get a layout that
 * always fills complete rows: one feature tile, then the rest balanced around it.
 */
function layoutFor(filter: Filter, list: Project[]): Project["size"][] {
  if (filter === "all") return list.map((p) => p.size);
  const rest = list.length - 1;
  const tail: Project["size"][] = rest === 1 ? ["wide"] : rest === 2 ? ["wide", "wide"] : rest === 3 ? ["wide", "regular", "regular"] : Array(Math.max(rest, 0)).fill("regular");
  return list.length ? ["large", ...tail] : [];
}

const sizeClass: Record<Project["size"], string> = {
  large: "col-span-2 row-span-2",
  wide: "col-span-2",
  regular: "col-span-1",
};

export function ProjectGallery() {
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => on("moss:gallery-filter", (f) => setFilter(f)), []);

  const visible = useMemo(() => (filter === "all" ? projects : projects.filter((p) => p.categories.includes(filter))), [filter]);
  const sizes = layoutFor(filter, visible);
  const openIndex = visible.findIndex((p) => p.id === openId);

  const open = (p: Project) => {
    setOpenId(p.id);
    trackEvent("project_viewed", { project: p.id, filter });
  };

  return (
    <section id="gallery" aria-labelledby="gallery-heading" className="relative bg-ivory-50 py-20 md:py-28">
      <div className="container-x">
        <div className="flex flex-col gap-8">
          <SectionHeading
            id="gallery-heading"
            eyebrow="Project Gallery"
            title="Spaces Made for Evenings Outside"
            intro="Patios, pools, kitchens, fire features and planting — browse by the type of space you're imagining."
          />
          <div data-reveal className="no-scrollbar -mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
            <div role="group" aria-label="Filter projects" className="flex w-max gap-1 rounded-full border border-ivory-300 bg-white p-1">
              {projectFilters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={filter === f.id}
                  onClick={() => setFilter(f.id)}
                  className={`relative rounded-full px-4 py-2.5 text-sm font-bold transition-colors ${filter === f.id ? "text-white" : "text-navy-800 hover:text-navy-950"}`}
                >
                  {filter === f.id && <motion.span layoutId="gallery-pill" className="absolute inset-0 rounded-full bg-navy-900" transition={{ type: "spring", bounce: 0.18, duration: 0.5 }} />}
                  <span className="relative">{f.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <LayoutGroup>
          <motion.ul layout className="mt-10 grid grid-flow-dense auto-rows-[10.5rem] grid-cols-2 gap-3 sm:auto-rows-[13rem] md:gap-4 lg:auto-rows-[15rem] lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {visible.map((p, i) => (
                <motion.li
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className={sizeClass[sizes[i]]}
                >
                  <button
                    type="button"
                    onClick={() => open(p)}
                    className="group relative block h-full w-full overflow-hidden rounded-2xl bg-navy-900 text-left"
                    aria-label={`View project: ${p.title}`}
                  >
                    <Image
                      src={p.images[0].src}
                      alt={p.images[0].alt}
                      fill
                      sizes={sizes[i] === "regular" ? "(min-width:1024px) 25vw, 50vw" : "(min-width:1024px) 50vw, 100vw"}
                      className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/10 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
                    <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                      <Expand width={16} height={16} />
                    </span>
                    <span className="absolute inset-x-0 bottom-0 p-3.5 md:p-5">
                      <span className="mb-1.5 block text-[0.65rem] font-bold uppercase tracking-[0.18em] text-ember-400 md:text-[0.7rem]">
                        {p.categories.map((c) => categoryLabels[c]).slice(0, sizes[i] === "regular" ? 1 : 2).join(" · ")}
                      </span>
                      <span className={`block font-serif font-bold leading-tight text-white ${sizes[i] === "large" ? "text-2xl md:text-3xl" : "text-base md:text-xl"}`}>{p.title}</span>
                    </span>
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>

        {visible.length === 0 && (
          <div className="mt-2 flex flex-col items-start gap-5 rounded-2xl border border-ivory-300 bg-white p-8 md:flex-row md:items-center md:justify-between md:p-10">
            <div>
              <p className="font-serif text-2xl font-bold text-navy-900">Commercial projects</p>
              <p className="mt-2 max-w-xl text-mist">
                Moss provides landscape installation and maintenance for commercial properties and communities. Tell us about your property and we&apos;ll share relevant work.
              </p>
            </div>
            <button type="button" onClick={() => requestEstimate({ projectType: "commercial", propertyType: "commercial" })} className="btn btn-dark shrink-0">
              Discuss Your Property <ArrowRight width={18} height={18} />
            </button>
          </div>
        )}

        {siteConfig.conceptMode && <p className="mt-6 text-xs text-mist/80">{siteConfig.imageryNote}</p>}
      </div>

      <ProjectLightbox
        project={openIndex >= 0 ? visible[openIndex] : null}
        onClose={() => setOpenId(null)}
        onNavigate={(dir) => {
          const next = visible[(openIndex + dir + visible.length) % visible.length];
          open(next);
        }}
        hasSiblings={visible.length > 1}
      />
    </section>
  );
}
