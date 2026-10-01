"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { transformations } from "@/data/transformations";
import { siteConfig } from "@/data/site";
import { trackEvent } from "@/lib/analytics";
import { Drag } from "./icons";
import { SectionHeading } from "./SectionHeading";

export function BeforeAfter() {
  const [index, setIndex] = useState(0);
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const frame = useRef<HTMLDivElement>(null);
  const tracked = useRef(new Set<string>());
  const item = transformations[index];

  const markUsed = useCallback(
    (method: string) => {
      if (tracked.current.has(item.id)) return;
      tracked.current.add(item.id);
      trackEvent("before_after_used", { project: item.id, method });
    },
    [item.id],
  );

  const setFromClientX = useCallback((clientX: number) => {
    const rect = frame.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  // One-time nudge so first-time visitors see it's interactive
  useEffect(() => {
    const el = frame.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timers: number[] = [];
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        timers = [window.setTimeout(() => setPos(32), 350), window.setTimeout(() => setPos(64), 1050), window.setTimeout(() => setPos(50), 1700)];
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 4;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") setPos((p) => Math.max(0, p - step));
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") setPos((p) => Math.min(100, p + step));
    else if (e.key === "Home") setPos(0);
    else if (e.key === "End") setPos(100);
    else return;
    e.preventDefault();
    markUsed("keyboard");
  };

  return (
    <section id="transformations" aria-labelledby="ba-heading" className="bg-ivory-100 py-20 md:py-28">
      <div className="container-x">
        <div className="flex flex-col gap-8">
          <SectionHeading
            id="ba-heading"
            eyebrow="Before & After"
            title="See the Transformation"
            intro="Every project starts as a plan drawn for your property. Drag the slider to see how the design becomes the finished space."
          />
          <div data-reveal role="tablist" aria-label="Choose a project" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0">
            {transformations.map((t, i) => (
              <button
                key={t.id}
                role="tab"
                type="button"
                aria-selected={i === index}
                aria-controls="ba-frame"
                onClick={() => {
                  setIndex(i);
                  setPos(50);
                }}
                className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-bold transition-colors ${
                  i === index ? "border-navy-900 bg-navy-900 text-white" : "border-ivory-300 text-navy-800 hover:border-navy-900"
                }`}
              >
                {t.title}
              </button>
            ))}
          </div>
        </div>

        <div data-reveal className="mt-10">
          <div
            id="ba-frame"
            ref={frame}
            role="tabpanel"
            className={`relative aspect-[4/3] select-none overflow-hidden rounded-2xl bg-navy-900 shadow-[0_40px_80px_-40px_rgba(10,18,25,0.6)] sm:aspect-[16/9] ${dragging ? "cursor-grabbing" : "cursor-ew-resize"}`}
            style={{ touchAction: "pan-y" }}
            onPointerDown={(e) => {
              (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
              setDragging(true);
              // touch: wait for a horizontal move so vertical page scrolls don't jump the slider
              if (e.pointerType !== "touch") setFromClientX(e.clientX);
              markUsed(e.pointerType);
            }}
            onPointerMove={(e) => dragging && setFromClientX(e.clientX)}
            onPointerUp={() => setDragging(false)}
            onPointerCancel={() => setDragging(false)}
          >
            <Image key={`a-${item.id}`} src={item.after.src} alt={item.after.alt} fill sizes="(min-width:1280px) 1200px, 100vw" className="pointer-events-none object-cover" draggable={false} />
            <div
              className={`absolute inset-0 ${dragging ? "" : "transition-[clip-path] duration-700 ease-[cubic-bezier(.22,1,.36,1)]"}`}
              style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
            >
              <Image key={`b-${item.id}`} src={item.before.src} alt={item.before.alt} fill sizes="(min-width:1280px) 1200px, 100vw" className="pointer-events-none object-cover" draggable={false} />
            </div>

            <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-ivory-50/90 px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-navy-900 md:left-5 md:top-5">
              {item.before.label}
            </span>
            <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-navy-950/80 px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-ember-400 md:right-5 md:top-5">
              {item.after.label}
            </span>

            <div
              className={`pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_20px_rgba(0,0,0,0.4)] ${dragging ? "" : "transition-[left] duration-700 ease-[cubic-bezier(.22,1,.36,1)]"}`}
              style={{ left: `${pos}%` }}
            >
              <div
                role="slider"
                tabIndex={0}
                aria-label={`Compare ${item.before.label.toLowerCase()} and ${item.after.label.toLowerCase()} for ${item.title}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(pos)}
                aria-valuetext={`${Math.round(pos)}% ${item.before.label}`}
                onKeyDown={onKey}
                className="pointer-events-auto absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-ember-500 text-navy-950 shadow-xl"
              >
                <Drag width={22} height={22} />
              </div>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className="text-[0.95rem] text-mist">
              <span className="font-serif text-lg font-bold text-navy-900">{item.title}.</span> {item.caption}
            </p>
            {siteConfig.conceptMode && <p className="text-xs text-mist/80">Concept: sketch renderings shown in place of site photos.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
