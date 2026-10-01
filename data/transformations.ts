/**
 * Before / After slider entries. In the concept these pair a design-sketch
 * rendering with the finished space; swap `before` for real site photos and
 * update the labels when Moss project photography is available.
 */

export type Transformation = {
  id: string;
  title: string;
  caption: string;
  before: { src: string; alt: string; label: string };
  after: { src: string; alt: string; label: string };
};

export const transformations: Transformation[] = [
  {
    id: "steps-terrace",
    title: "Stone Steps & Terrace",
    caption: "Retaining walls and lit steps turn a grade change into the backbone of the yard.",
    before: { src: "/images/lit-steps-pavilion-concept.jpg", alt: "Design sketch of stone steps, retaining walls and a pavilion", label: "Design Concept" },
    after: { src: "/images/lit-steps-pavilion.jpg", alt: "Completed illuminated stone steps leading to a pavilion", label: "Completed" },
  },
  {
    id: "front-entry",
    title: "Front Entry & Walkway",
    caption: "A curved paver walk, seat walls and layered planting for a stronger arrival.",
    before: { src: "/images/front-entry-walkway-concept.jpg", alt: "Design sketch of a curved front walkway and plantings", label: "Design Concept" },
    after: { src: "/images/front-entry-walkway.jpg", alt: "Completed paver walkway with lit plantings at the front entry", label: "Completed" },
  },
  {
    id: "fire-lounge",
    title: "Fire Lounge & Kitchen",
    caption: "A sunken fire lounge, water wall and outdoor kitchen designed as one space.",
    before: { src: "/images/fire-lounge-terrace-concept.jpg", alt: "Design sketch of a fire lounge, water wall and outdoor kitchen", label: "Design Concept" },
    after: { src: "/images/fire-lounge-terrace.jpg", alt: "Completed fire lounge with outdoor kitchen at dusk", label: "Completed" },
  },
];
