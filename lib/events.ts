/**
 * Tiny cross-component event bus so sections can hand off intent
 * (e.g. service card → pre-filled estimate) without a global store.
 */
import type { ProjectTypeId, PropertyTypeId } from "@/data/estimate";
import type { ProjectCategory } from "@/data/projects";

export type EstimatePrefill = {
  projectType?: ProjectTypeId;
  propertyType?: PropertyTypeId;
  location?: string;
};

type EventMap = {
  "moss:estimate-prefill": EstimatePrefill;
  "moss:gallery-filter": ProjectCategory | "all";
};

export function emit<K extends keyof EventMap>(name: K, detail: EventMap[K]) {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export function on<K extends keyof EventMap>(name: K, handler: (detail: EventMap[K]) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<EventMap[K]>).detail);
  window.addEventListener(name, listener);
  return () => window.removeEventListener(name, listener);
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

export function requestEstimate(prefill: EstimatePrefill = {}) {
  emit("moss:estimate-prefill", prefill);
  scrollToId("estimate");
}
