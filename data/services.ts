import type { ProjectCategory } from "./projects";
import type { ProjectTypeId } from "./estimate";

export type Service = {
  id: string;
  title: string;
  /** Two-line card title split, keeps cards tidy at narrow widths */
  shortTitle: string;
  summary: string;
  image: string;
  imageAlt: string;
  /** Gallery filter applied when the card's "See projects" action is used */
  galleryCategory: ProjectCategory;
  /** Estimate wizard project type pre-selected from this card */
  estimateType: ProjectTypeId;
  points: string[];
};

export const services: Service[] = [
  {
    id: "landscape-design",
    title: "Landscape Design & Installation",
    shortTitle: "Landscape Design & Installation",
    summary: "Custom plans that balance planting, structure and lighting, then installed by our own crews.",
    image: "/images/front-entry-walkway.jpg",
    imageAlt: "Curved paver walkway lined with lit garden beds leading to a stone front entry",
    galleryCategory: "landscapes",
    estimateType: "landscape-design",
    points: ["Site planning", "Planting design", "Installation"],
  },
  {
    id: "patios-hardscapes",
    title: "Patios & Hardscapes",
    shortTitle: "Patios & Hardscapes",
    summary: "Paver and natural-stone patios, walkways and steps built on a properly prepared base.",
    image: "/images/detail-round-firepit.jpg",
    imageAlt: "Paver patio with a round stone fire pit and lounge seating at dusk",
    galleryCategory: "hardscapes",
    estimateType: "patio-hardscape",
    points: ["Patios", "Walkways", "Steps"],
  },
  {
    id: "outdoor-living",
    title: "Outdoor Living & Kitchens",
    shortTitle: "Outdoor Living & Kitchens",
    summary: "Outdoor kitchens, fire features and covered seating designed for everyday use.",
    image: "/images/detail-outdoor-kitchen.jpg",
    imageAlt: "Stone outdoor kitchen with grill, bar seating and pendant lights under a covered pavilion",
    galleryCategory: "outdoor-living",
    estimateType: "outdoor-kitchen",
    points: ["Outdoor kitchens", "Fire features", "Seating areas"],
  },
  {
    id: "pools-water",
    title: "Pools & Water Features",
    shortTitle: "Pools & Water Features",
    summary: "Pool surroundings, coping, decking and water features that tie into the whole landscape.",
    image: "/images/sunset-pool-waterfall.jpg",
    imageAlt: "Natural stone waterfall spilling into a pool surrounded by paver decking at sunset",
    galleryCategory: "pools",
    estimateType: "pool-water",
    points: ["Pool surrounds", "Waterfalls", "Decking"],
  },
  {
    id: "retaining-walls",
    title: "Retaining Walls & Stone Work",
    shortTitle: "Retaining Walls & Stone Work",
    summary: "Retaining walls, seat walls and stone steps that handle grade changes cleanly.",
    image: "/images/detail-lit-stone-steps.jpg",
    imageAlt: "Illuminated stone steps between retaining walls with garden plantings",
    galleryCategory: "hardscapes",
    estimateType: "retaining-wall",
    points: ["Retaining walls", "Seat walls", "Stone steps"],
  },
  {
    id: "commercial",
    title: "Commercial Landscaping",
    shortTitle: "Commercial Landscaping",
    summary: "Landscape installation and maintenance for businesses, properties and communities.",
    image: "/images/detail-garden-grounds.jpg",
    imageAlt: "Manicured lawn edged with lit planting beds and pathway lights",
    galleryCategory: "commercial",
    estimateType: "commercial",
    points: ["Installation", "Maintenance", "Property enhancement"],
  },
];

/** Supporting services shown as a compact row beneath the main cards */
export const supportingServices = [
  { id: "planting", label: "Planting & Softscape", icon: "leaf" },
  { id: "maintenance", label: "Landscape Maintenance", icon: "shears" },
  { id: "walkways", label: "Walkways", icon: "path" },
  { id: "lighting", label: "Landscape Lighting", icon: "light" },
] as const;

export const outdoorLivingFeatures = [
  { label: "Patios", detail: "Gathering space sized to how you entertain." },
  { label: "Outdoor Kitchens", detail: "Grills, counters and bar seating in stone." },
  { label: "Fire Features", detail: "Fire pits and fire tables as a focal point." },
  { label: "Seating Areas", detail: "Built-in seat walls and lounge zones." },
  { label: "Pool Surroundings", detail: "Coping, decking and lounging terraces." },
  { label: "Lighting", detail: "Warm, layered light for evenings outside." },
];

export const hardscapeFeatures = [
  { label: "Patios", image: "/images/detail-fire-table-lounge.jpg", alt: "Stone patio with a lit fire table and sectional seating" },
  { label: "Walkways", image: "/images/front-entry-walkway.jpg", alt: "Curving paver walkway with path lights" },
  { label: "Retaining Walls", image: "/images/detail-seat-wall-planting.jpg", alt: "Lit stone retaining wall with hydrangea plantings" },
  { label: "Steps", image: "/images/detail-lit-stone-steps.jpg", alt: "Wide stone steps with under-tread lighting" },
  { label: "Stonework", image: "/images/detail-natural-stone-falls.jpg", alt: "Natural boulder waterfall and stone wall beside a pool" },
  { label: "Pavers", image: "/images/detail-sunken-firepit.jpg", alt: "Paver terrace with lit stone edges and a water feature" },
];

export const audienceSplit = {
  residential: {
    title: "Residential",
    image: "/images/firepit-pavilion-garden.jpg",
    imageAlt: "Backyard with fire pit seating, outdoor kitchen pavilion and gardens at sunset",
    items: ["Landscape design", "Outdoor living", "Patios", "Plantings", "Pools & water features", "Maintenance"],
  },
  commercial: {
    title: "Commercial",
    image: "/images/detail-garden-grounds.jpg",
    imageAlt: "Well-kept lawn and planting beds with landscape lighting",
    items: ["Landscape installation", "Maintenance", "Community landscaping", "Property enhancement"],
  },
} as const;
