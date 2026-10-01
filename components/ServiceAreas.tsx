"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { regions, serviceAreas, stateAbbr, type ServiceArea } from "@/data/serviceAreas";
import { trackEvent } from "@/lib/analytics";
import { requestEstimate } from "@/lib/events";
import { areasByRegion, matchServiceArea, regionLabel, suggestServiceAreas, type AreaMatch } from "@/lib/serviceAreas";
import { ArrowRight, Check, MapPin, Search } from "./icons";

const groups = areasByRegion();

export function ServiceAreas() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<AreaMatch>({ status: "empty" });
  const [openList, setOpenList] = useState(false);
  const [hi, setHi] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const suggestions = useMemo(() => suggestServiceAreas(query), [query]);
  const selected = result.status === "match" ? result.area.slug : null;

  const check = (value: string, via: "typed" | "suggestion" | "chip", area?: ServiceArea) => {
    const r: AreaMatch = area ? { status: "match", area, via: "name" } : matchServiceArea(value);
    setResult(r);
    setOpenList(false);
    if (r.status !== "empty") {
      trackEvent("service_area_checked", {
        query: value,
        result: r.status,
        town: r.status === "match" ? r.area.name : null,
        via,
      });
    }
  };

  const pick = (a: ServiceArea, via: "suggestion" | "chip") => {
    setQuery(`${a.name}, ${stateAbbr}`);
    check(a.name, via, a);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && suggestions.length) {
      e.preventDefault();
      setOpenList(true);
      setHi((h) => (h + 1) % suggestions.length);
    } else if (e.key === "ArrowUp" && suggestions.length) {
      e.preventDefault();
      setHi((h) => (h - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Escape") {
      setOpenList(false);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (openList && suggestions[hi]) pick(suggestions[hi], "suggestion");
      else check(query, "typed");
    }
  };

  const showList = openList && suggestions.length > 0 && query.trim().length > 0;

  return (
    <section id="service-areas" aria-labelledby="areas-heading" className="relative isolate overflow-hidden bg-forest-950 py-20 text-white md:py-28">
      <div className="absolute inset-y-0 right-0 -z-10 hidden w-[42%] lg:block">
        <Image src="/images/front-entry-walkway.jpg" alt="" fill sizes="42vw" className="object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-950/70 to-forest-950/10" />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.07]"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "26px 26px" }}
      />

      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        {/* checker */}
        <div>
          <div data-reveal>
            <p className="eyebrow mb-4 flex items-center gap-3 text-ember-400">
              <span className="h-px w-8 bg-ember-400" /> Service Areas
            </p>
            <h2 id="areas-heading" className="font-serif text-[2.25rem] font-bold leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
              Proudly Serving Across New Jersey
            </h2>
            <p className="mt-5 max-w-lg text-[1.05rem] leading-relaxed text-white/75">
              From the Somerset Hills to the Jersey Shore, Moss designs, builds and maintains outdoor spaces in {serviceAreas.length} communities across{" "}
              {regions.length} regions.
            </p>
          </div>

          <div data-reveal className="mt-9 rounded-3xl border border-white/12 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-md md:p-7">
            <label htmlFor="area-input" className="font-serif text-2xl font-bold">
              Where are you located?
            </label>
            <p className="mt-1 text-sm text-white/65">Enter your town or ZIP code.</p>
            <div className="relative mt-4">
              <div className="flex items-center gap-2 rounded-full bg-white p-1.5 pl-4 text-navy-950 shadow-lg focus-within:ring-2 focus-within:ring-ember-500">
                <Search className="shrink-0 text-mist" />
                <input
                  ref={inputRef}
                  id="area-input"
                  type="text"
                  inputMode="search"
                  autoComplete="off"
                  enterKeyHint="search"
                  placeholder="e.g. Summit or 07901"
                  value={query}
                  role="combobox"
                  aria-expanded={showList}
                  aria-controls={listId}
                  aria-autocomplete="list"
                  aria-activedescendant={showList ? `${listId}-${hi}` : undefined}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setOpenList(true);
                    setHi(0);
                    if (result.status !== "empty") setResult({ status: "empty" });
                  }}
                  onFocus={() => setOpenList(true)}
                  onBlur={() => setTimeout(() => setOpenList(false), 120)}
                  onKeyDown={onKeyDown}
                  className="min-w-0 flex-1 bg-transparent py-2.5 text-base font-semibold placeholder:font-medium placeholder:text-mist/70 focus:outline-none"
                />
                <button type="button" onClick={() => check(query, "typed")} className="btn btn-primary shrink-0 !px-5 !py-3 text-sm">
                  Check
                </button>
              </div>
              {showList && (
                <ul id={listId} role="listbox" className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-2xl bg-white py-1.5 text-navy-950 shadow-2xl">
                  {suggestions.map((a, i) => (
                    <li
                      key={a.slug}
                      id={`${listId}-${i}`}
                      role="option"
                      aria-selected={i === hi}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => pick(a, "suggestion")}
                      onMouseEnter={() => setHi(i)}
                      className={`flex cursor-pointer items-center justify-between px-4 py-3 ${i === hi ? "bg-ivory-100" : ""}`}
                    >
                      <span className="flex items-center gap-2.5 font-semibold">
                        <MapPin width={16} height={16} className="text-ember-600" />
                        {a.name}, {stateAbbr}
                      </span>
                      <span className="text-xs text-mist">{regionLabel(a.region)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div aria-live="polite" className="min-h-[1px]">
              <AnimatePresence mode="wait">
                {result.status === "match" && (
                  <motion.div
                    key={result.area.slug}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-5 rounded-2xl bg-ivory-50 p-5 text-navy-950"
                  >
                    <div className="flex items-start gap-3.5">
                      <motion.span
                        initial={{ scale: 0.4 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 380, damping: 16 }}
                        className="grid size-10 shrink-0 place-items-center rounded-full bg-forest-700 text-white"
                      >
                        <Check width={20} height={20} />
                      </motion.span>
                      <div>
                        <p className="font-serif text-xl font-bold leading-snug">Yes — Moss Landscaping serves {result.area.name}, {stateAbbr}.</p>
                        <p className="mt-1 text-sm text-mist">
                          {regionLabel(result.area.region)} · Design, hardscapes, outdoor living & maintenance
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                      <button
                        type="button"
                        onClick={() => requestEstimate({ location: `${result.area.name}, ${stateAbbr}` })}
                        className="btn btn-primary"
                      >
                        Request an Estimate <ArrowRight width={18} height={18} />
                      </button>
                      <Link href={`/service-areas/${result.area.slug}`} className="link-arrow px-2 text-sm text-navy-800 hover:text-ember-700">
                        Landscaping in {result.area.name} <ArrowRight width={16} height={16} />
                      </Link>
                    </div>
                  </motion.div>
                )}
                {result.status === "unknown" && (
                  <motion.div
                    key="unknown"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mt-5 rounded-2xl border border-white/15 bg-navy-950/40 p-5"
                  >
                    <p className="font-serif text-xl font-bold">&ldquo;{result.query}&rdquo; isn&apos;t on our listed areas yet.</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/75">
                      Moss works across many New Jersey communities. Send your project details and we&apos;ll confirm whether we can help.
                    </p>
                    <button type="button" onClick={() => requestEstimate({ location: result.query })} className="btn btn-ghost-light mt-4 !py-3 text-sm">
                      Ask About My Area <ArrowRight width={16} height={16} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* town directory */}
        <div data-reveal className="gap-3 sm:columns-2 lg:pt-4">
          {groups.map((g) => (
            <div key={g.id} className="mb-3 break-inside-avoid rounded-2xl border border-white/10 bg-forest-900/70 p-4 backdrop-blur-sm">
              <p className="mb-3 flex items-center justify-between text-[0.7rem] font-bold uppercase tracking-[0.18em] text-ember-400">
                {g.label}
                <span className="text-white/40">{g.areas.length}</span>
              </p>
              <ul className="flex flex-wrap gap-1.5">
                {g.areas.map((a) => (
                  <li key={a.slug}>
                    <button
                      type="button"
                      onClick={() => pick(a, "chip")}
                      aria-pressed={selected === a.slug}
                      className={`rounded-full border px-3 py-1.5 text-[0.82rem] font-semibold transition-colors ${
                        selected === a.slug
                          ? "border-ember-500 bg-ember-500 text-navy-950"
                          : "border-white/15 bg-white/[0.04] text-white/85 hover:border-white/40 hover:text-white"
                      }`}
                    >
                      {a.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
