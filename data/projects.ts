/**
 * Gallery projects. Descriptions only describe what is visible —
 * no client names, addresses, budgets or scope claims.
 */

export type ProjectCategory = "landscapes" | "hardscapes" | "outdoor-living" | "pools" | "commercial";

export const projectFilters: { id: "all" | ProjectCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "landscapes", label: "Landscapes" },
  { id: "hardscapes", label: "Hardscapes" },
  { id: "outdoor-living", label: "Outdoor Living" },
  { id: "pools", label: "Pools" },
  { id: "commercial", label: "Commercial" },
];

export const categoryLabels: Record<ProjectCategory, string> = {
  landscapes: "Landscapes",
  hardscapes: "Hardscapes",
  "outdoor-living": "Outdoor Living",
  pools: "Pools",
  commercial: "Commercial",
};

export type ProjectImage = { src: string; alt: string; width: number; height: number };

export type Project = {
  id: string;
  title: string;
  categories: ProjectCategory[];
  description: string;
  features: string[];
  /** Grid emphasis on desktop */
  size: "large" | "wide" | "regular";
  images: ProjectImage[];
};

const full = (src: string, alt: string): ProjectImage => ({ src, alt, width: 1672, height: 941 });

export const projects: Project[] = [
  {
    id: "poolside-terrace-pavilion",
    title: "Poolside Terrace & Pavilion",
    categories: ["pools", "outdoor-living", "hardscapes"],
    description:
      "A layered backyard that steps down from a lit planting terrace to the pool, with raised spillways, a fire lounge and a covered kitchen pavilion tying the spaces together.",
    features: ["Raised spillways", "Fire lounge", "Covered kitchen", "Lit stone steps"],
    size: "large",
    images: [
      full("/images/poolside-terrace-dusk.jpg", "Pool with raised stone spillways, lounge chairs and a covered pavilion at dusk"),
      { src: "/images/detail-pool-cabana.jpg", alt: "Spillways and kitchen pavilion beside the pool", width: 1111, height: 600 },
      { src: "/images/detail-sunken-firepit.jpg", alt: "Lit terrace edges and garden beds", width: 900, height: 501 },
    ],
  },
  {
    id: "covered-kitchen-dining",
    title: "Covered Outdoor Kitchen & Dining",
    categories: ["outdoor-living"],
    description:
      "A stone outdoor kitchen under a timber-ceilinged pavilion, with bar seating, a dining terrace and a water feature stepping down to the pool.",
    features: ["Outdoor kitchen", "Bar seating", "Dining terrace", "Water feature"],
    size: "wide",
    images: [
      full("/images/outdoor-kitchen-dining.jpg", "Covered outdoor kitchen and dining table beside a pool with a waterfall"),
      { src: "/images/detail-outdoor-kitchen.jpg", alt: "Stone kitchen island with grill and pendant lighting", width: 792, height: 600 },
      { src: "/images/detail-pool-waterfall.jpg", alt: "Lit sheer-descent water feature and stone steps", width: 760, height: 430 },
    ],
  },
  {
    id: "fire-lounge-terrace",
    title: "Fire Lounge & Garden Terrace",
    categories: ["outdoor-living", "hardscapes"],
    description:
      "A sunken lounge built around a stone fire table, framed by lit seat walls, a sheer water feature and generous planting.",
    features: ["Fire table", "Sunken lounge", "Sheer water feature", "Under-cap lighting"],
    size: "regular",
    images: [
      full("/images/fire-lounge-terrace.jpg", "Sunken fire table lounge with sectional seating and a lit water wall"),
      { src: "/images/detail-fire-table-lounge.jpg", alt: "Stone fire table with sectional seating", width: 1112, height: 561 },
      { src: "/images/detail-sunken-firepit.jpg", alt: "Water wall and lit terrace edges", width: 900, height: 501 },
    ],
  },
  {
    id: "front-entry-walkway",
    title: "Front Entry Walkway & Plantings",
    categories: ["landscapes", "hardscapes"],
    description:
      "A curving paver walkway leads to lit stone steps, with seat walls, layered planting beds and path lighting creating a welcoming arrival.",
    features: ["Paver walkway", "Lit entry steps", "Seat walls", "Planting beds"],
    size: "regular",
    images: [
      full("/images/front-entry-walkway.jpg", "Curving paver walkway with garden lights leading to a stone front entry"),
      { src: "/images/detail-seat-wall-planting.jpg", alt: "Stone seat wall with hydrangeas and up-lit trees", width: 1000, height: 561 },
      { src: "/images/detail-entry-steps.jpg", alt: "Illuminated entry steps and planters", width: 912, height: 640 },
    ],
  },
  {
    id: "sunset-pool-fire",
    title: "Sunset Pool & Fire Feature",
    categories: ["pools", "outdoor-living"],
    description:
      "An open pool deck oriented to the view, with a raised spillway, fire table seating and an outdoor kitchen pavilion at the edge of the terrace.",
    features: ["Spillway", "Fire table", "Pool deck", "Outdoor kitchen"],
    size: "wide",
    images: [
      full("/images/sunset-pool-fire-lounge.jpg", "Pool with spillway and fire table seating at sunset"),
    ],
  },
  {
    id: "lit-steps-retaining-walls",
    title: "Illuminated Steps & Retaining Walls",
    categories: ["hardscapes", "landscapes"],
    description:
      "Wide stone steps with integrated lighting climb between retaining walls to a fire lounge terrace and dining pavilion.",
    features: ["Stone steps", "Retaining walls", "Step lighting", "Dining pavilion"],
    size: "large",
    images: [
      full("/images/lit-steps-pavilion.jpg", "Illuminated stone steps between retaining walls leading to a pavilion"),
      { src: "/images/detail-lit-stone-steps.jpg", alt: "Close-up of stone steps with under-tread lighting", width: 880, height: 501 },
      { src: "/images/detail-pavilion-dining.jpg", alt: "Dining pavilion with stone columns", width: 812, height: 500 },
      { src: "/images/detail-garden-grounds.jpg", alt: "Lawn and planting beds with path lighting", width: 692, height: 521 },
    ],
  },
  {
    id: "firepit-courtyard",
    title: "Fire Pit Courtyard & Garden",
    categories: ["outdoor-living", "landscapes"],
    description:
      "A round fire pit courtyard set between a covered kitchen and a lawn edged in lit planting, with steps rising to a raised pool terrace.",
    features: ["Round fire pit", "Covered kitchen", "Garden beds", "Stepping stones"],
    size: "regular",
    images: [
      full("/images/firepit-pavilion-garden.jpg", "Round fire pit with lounge chairs, outdoor kitchen pavilion and gardens"),
      { src: "/images/detail-round-firepit.jpg", alt: "Stone fire pit with lounge chairs", width: 940, height: 541 },
    ],
  },
  {
    id: "natural-stone-waterfall-pool",
    title: "Natural Stone Waterfall Pool",
    categories: ["pools", "hardscapes"],
    description:
      "Boulder waterfalls cascade into a freeform pool, with a stone deck stepping up to a lit patio and covered seating.",
    features: ["Boulder waterfall", "Freeform pool deck", "Stone pillars", "Accent lighting"],
    size: "regular",
    images: [
      full("/images/sunset-pool-waterfall.jpg", "Freeform pool with natural boulder waterfall at sunset"),
      { src: "/images/detail-natural-stone-falls.jpg", alt: "Natural boulder waterfall detail", width: 920, height: 560 },
    ],
  },
];
