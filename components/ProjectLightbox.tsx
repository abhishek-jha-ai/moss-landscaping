"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { categoryLabels, type Project, type ProjectCategory } from "@/data/projects";
import type { ProjectTypeId } from "@/data/estimate";
import { requestEstimate } from "@/lib/events";
import { ArrowLeft, ArrowRight, Check, Close } from "./icons";

const estimateTypeFor: Partial<Record<ProjectCategory, ProjectTypeId>> = {
  landscapes: "landscape-design",
  hardscapes: "patio-hardscape",
  pools: "pool-water",
  commercial: "commercial",
};

type Props = {
  project: Project | null;
  onClose: () => void;
  onNavigate: (dir: 1 | -1) => void;
  hasSiblings: boolean;
};

export function ProjectLightbox({ project, onClose, onNavigate, hasSiblings }: Props) {
  // image index is tied to the project it belongs to, so switching projects resets it
  const [imgState, setImgState] = useState({ id: "", i: 0 });
  const img = imgState.id === project?.id ? imgState.i : 0;
  const setImg = (next: number | ((i: number) => number)) =>
    setImgState((s) => {
      const cur = s.id === project?.id ? s.i : 0;
      return { id: project?.id ?? "", i: typeof next === "function" ? next(cur) : next };
    });
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!project) return;
    returnFocus.current = (document.activeElement as HTMLElement) ?? null;
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      document.documentElement.style.overflow = "";
      returnFocus.current?.focus({ preventScroll: true });
    };
  }, [project]);

  useEffect(() => {
    if (!project) return;
    const count = project.images.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const step = e.key === "ArrowRight" ? 1 : -1;
        setImgState((s) => ({ id: project.id, i: ((s.id === project.id ? s.i : 0) + step + count) % count }));
      }
      else if (e.key === "Tab" && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>("button, a[href], [tabindex]:not([tabindex='-1'])");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-navy-950/85 backdrop-blur-sm md:items-center md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-title"
            className="relative flex max-h-[94svh] w-full max-w-6xl flex-col overflow-hidden rounded-t-3xl bg-ivory-50 md:grid md:max-h-[88vh] md:grid-cols-[1.6fr_1fr] md:rounded-3xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* media */}
            <div className="flex min-h-0 flex-col bg-navy-950">
              <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden md:aspect-auto md:flex-1">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.div
                    key={`${project.id}-${img}`}
                    className="absolute inset-0 touch-pan-y"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    drag={project.images.length > 1 ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.25}
                    onDragEnd={(_, info) => {
                      const n = project.images.length;
                      if (info.offset.x < -60) setImg((i) => (i + 1) % n);
                      else if (info.offset.x > 60) setImg((i) => (i - 1 + n) % n);
                    }}
                  >
                    <Image
                      src={project.images[img].src}
                      alt={project.images[img].alt}
                      fill
                      sizes="(min-width:768px) 62vw, 100vw"
                      className="pointer-events-none object-cover"
                      draggable={false}
                    />
                  </motion.div>
                </AnimatePresence>
                {project.images.length > 1 && (
                  <span className="absolute bottom-3 right-3 rounded-full bg-navy-950/70 px-2.5 py-1 text-xs font-bold text-white">
                    {img + 1} / {project.images.length}
                  </span>
                )}
              </div>
              {project.images.length > 1 && (
                <div className="no-scrollbar flex shrink-0 gap-2 overflow-x-auto p-3">
                  {project.images.map((im, i) => (
                    <button
                      key={im.src}
                      type="button"
                      onClick={() => setImg(i)}
                      aria-label={`Show image ${i + 1}: ${im.alt}`}
                      aria-current={i === img}
                      className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg transition md:h-16 md:w-24 ${i === img ? "ring-2 ring-ember-500" : "opacity-60 hover:opacity-100"}`}
                    >
                      <Image src={im.src} alt="" fill sizes="96px" className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* details */}
            <div className="flex min-h-0 flex-col overflow-y-auto p-6 md:p-8">
              <div className="flex flex-wrap gap-1.5 pr-10">
                {project.categories.map((c) => (
                  <span key={c} className="rounded-full bg-forest-800 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-ivory-100">
                    {categoryLabels[c]}
                  </span>
                ))}
              </div>
              <h3 id="lightbox-title" className="mt-4 font-serif text-3xl font-bold leading-tight text-navy-900">
                {project.title}
              </h3>
              <p className="mt-4 leading-relaxed text-mist">{project.description}</p>
              <ul className="mt-6 grid grid-cols-2 gap-2.5">
                {project.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm font-semibold text-navy-800">
                    <Check width={16} height={16} className="shrink-0 text-forest-500" /> {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <button
                  type="button"
                  className="btn btn-primary w-full"
                  onClick={() => {
                    onClose();
                    const type = project.categories.map((c) => estimateTypeFor[c]).find(Boolean);
                    setTimeout(() => requestEstimate(type ? { projectType: type } : {}), 50);
                  }}
                >
                  Plan a Project Like This <ArrowRight width={18} height={18} />
                </button>
                {hasSiblings && (
                  <div className="mt-4 flex justify-between text-sm font-bold text-navy-800">
                    <button type="button" onClick={() => onNavigate(-1)} className="link-arrow hover:text-ember-700">
                      <ArrowLeft width={16} height={16} /> Previous
                    </button>
                    <button type="button" onClick={() => onNavigate(1)} className="link-arrow hover:text-ember-700">
                      Next project <ArrowRight width={16} height={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close project"
              className="absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-full bg-navy-950/70 text-white backdrop-blur hover:bg-navy-950 md:right-4 md:top-4 md:bg-navy-900"
            >
              <Close width={20} height={20} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
