/**
 * Service areas as listed on Moss Landscaping's current website.
 * Edit this list to add/remove towns — the checker, chips, estimate
 * validation, structured data and /service-areas/[slug] pages all read from it.
 *
 * `zips` are used only to recognise ZIP input in the checker; a ZIP that is
 * not listed is never rejected, it just gets a "we'll confirm" response.
 */

export type ServiceArea = {
  slug: string;
  name: string;
  region: RegionId;
  zips: string[];
  /** Alternate spellings people may type */
  aliases?: string[];
};

export type RegionId = "somerset" | "hunterdon" | "essex-union-morris" | "monmouth" | "lbi" | "mercer";

export const regions: { id: RegionId; label: string }[] = [
  { id: "somerset", label: "Somerset County" },
  { id: "hunterdon", label: "Hunterdon County" },
  { id: "essex-union-morris", label: "Essex, Union & Morris" },
  { id: "monmouth", label: "Monmouth Shore" },
  { id: "lbi", label: "Long Beach Island" },
  { id: "mercer", label: "Mercer County" },
];

export const serviceAreas: ServiceArea[] = [
  { slug: "branchburg", name: "Branchburg", region: "somerset", zips: ["08876", "08853"] },
  { slug: "bridgewater", name: "Bridgewater", region: "somerset", zips: ["08807", "08836"] },
  { slug: "millburn", name: "Millburn", region: "essex-union-morris", zips: ["07041"] },
  { slug: "fair-haven", name: "Fair Haven", region: "monmouth", zips: ["07704"], aliases: ["fairhaven"] },
  { slug: "short-hills", name: "Short Hills", region: "essex-union-morris", zips: ["07078"] },
  { slug: "red-bank", name: "Red Bank", region: "monmouth", zips: ["07701"] },
  { slug: "peapack", name: "Peapack", region: "somerset", zips: ["07977"], aliases: ["peapack-gladstone", "peapack gladstone"] },
  { slug: "summit", name: "Summit", region: "essex-union-morris", zips: ["07901"] },
  { slug: "montgomery", name: "Montgomery", region: "somerset", zips: ["08502", "08558"], aliases: ["belle mead", "skillman"] },
  { slug: "spring-lake", name: "Spring Lake", region: "monmouth", zips: ["07762"] },
  { slug: "princeton", name: "Princeton", region: "mercer", zips: ["08540", "08542", "08544"] },
  { slug: "sea-girt", name: "Sea Girt", region: "monmouth", zips: ["08750"] },
  { slug: "bernards", name: "Bernards", region: "somerset", zips: ["07920"], aliases: ["basking ridge", "bernards township"] },
  { slug: "clinton", name: "Clinton", region: "hunterdon", zips: ["08809"] },
  { slug: "beach-haven", name: "Beach Haven", region: "lbi", zips: ["08008"] },
  { slug: "tewksbury", name: "Tewksbury", region: "hunterdon", zips: ["07830", "08858", "07979"], aliases: ["oldwick", "califon", "pottersville"] },
  { slug: "bernardsville", name: "Bernardsville", region: "somerset", zips: ["07924"] },
  { slug: "gladstone", name: "Gladstone", region: "somerset", zips: ["07934"] },
  { slug: "chatham", name: "Chatham", region: "essex-union-morris", zips: ["07928"] },
  { slug: "raritan-township", name: "Raritan Township", region: "hunterdon", zips: ["08822"] },
  { slug: "somerville", name: "Somerville", region: "somerset", zips: ["08876"] },
  { slug: "long-beach-township", name: "Long Beach Township", region: "lbi", zips: ["08008"], aliases: ["lbi", "long beach island"] },
  { slug: "flemington", name: "Flemington", region: "hunterdon", zips: ["08822"] },
  { slug: "lebanon", name: "Lebanon", region: "hunterdon", zips: ["08833"] },
];

export const stateAbbr = "NJ";
