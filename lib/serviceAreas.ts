import { regions, serviceAreas, type ServiceArea } from "@/data/serviceAreas";

const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/,?\s*(nj|new jersey)\b\.?/g, "")
    .replace(/\b(twp|township|borough|boro)\b\.?/g, (m) => (m.startsWith("t") ? "township" : ""))
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const keysFor = (a: ServiceArea) => [a.name, ...(a.aliases ?? [])].map(normalize);

export type AreaMatch =
  | { status: "match"; area: ServiceArea; via: "name" | "zip" }
  | { status: "unknown"; query: string }
  | { status: "empty" };

export function matchServiceArea(input: string): AreaMatch {
  const raw = input.trim();
  if (!raw) return { status: "empty" };
  const zip = raw.match(/\b(\d{5})\b/)?.[1];
  if (zip) {
    const area = serviceAreas.find((a) => a.zips.includes(zip));
    return area ? { status: "match", area, via: "zip" } : { status: "unknown", query: raw };
  }
  const q = normalize(raw);
  if (!q) return { status: "empty" };
  const exact = serviceAreas.find((a) => keysFor(a).includes(q));
  if (exact) return { status: "match", area: exact, via: "name" };
  return { status: "unknown", query: raw };
}

/** Typeahead suggestions — prefix matches first, then substring matches. */
export function suggestServiceAreas(input: string, limit = 6): ServiceArea[] {
  const q = normalize(input);
  if (!q) return [];
  if (/^\d{1,5}$/.test(q)) return serviceAreas.filter((a) => a.zips.some((z) => z.startsWith(q))).slice(0, limit);
  const scored = serviceAreas
    .map((a) => {
      const keys = keysFor(a);
      const score = keys.some((k) => k.startsWith(q)) ? 0 : keys.some((k) => k.split(" ").some((w) => w.startsWith(q))) ? 1 : keys.some((k) => k.includes(q)) ? 2 : -1;
      return { a, score };
    })
    .filter((x) => x.score >= 0)
    .sort((x, y) => x.score - y.score || x.a.name.localeCompare(y.a.name));
  return scored.slice(0, limit).map((x) => x.a);
}

export const regionLabel = (id: ServiceArea["region"]) => regions.find((r) => r.id === id)?.label ?? "";

export const areasByRegion = () =>
  regions.map((r) => ({
    ...r,
    areas: serviceAreas.filter((a) => a.region === r.id).sort((a, b) => a.name.localeCompare(b.name)),
  }));

export const findArea = (slug: string) => serviceAreas.find((a) => a.slug === slug);
