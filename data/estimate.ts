/**
 * Estimate wizard configuration. Steps, options and copy live here so the
 * funnel can be reordered or re-worded without touching the component.
 */

export const projectTypes = [
  { id: "landscape-design", label: "Landscape Design" },
  { id: "patio-hardscape", label: "Patio / Hardscape" },
  { id: "outdoor-kitchen", label: "Outdoor Kitchen" },
  { id: "pool-water", label: "Pool / Water Feature" },
  { id: "retaining-wall", label: "Retaining Wall" },
  { id: "commercial", label: "Commercial Landscaping" },
  { id: "maintenance", label: "Maintenance" },
  { id: "other", label: "Other" },
] as const;

export const propertyTypes = [
  { id: "residential", label: "Residential" },
  { id: "commercial", label: "Commercial" },
  { id: "hoa", label: "HOA / Community" },
  { id: "other", label: "Other" },
] as const;

export const timelines = [
  { id: "asap", label: "ASAP" },
  { id: "1-3-months", label: "1–3 Months" },
  { id: "3-6-months", label: "3–6 Months" },
  { id: "planning", label: "Planning / Exploring" },
] as const;

export type ProjectTypeId = (typeof projectTypes)[number]["id"];
export type PropertyTypeId = (typeof propertyTypes)[number]["id"];
export type TimelineId = (typeof timelines)[number]["id"];

export const estimateSteps = [
  { id: "project", title: "What type of project are you planning?", short: "Project" },
  { id: "property", title: "What type of property is it?", short: "Property" },
  { id: "location", title: "Where is the property located?", short: "Location" },
  { id: "timeline", title: "When are you hoping to start?", short: "Timeline" },
  { id: "details", title: "Tell us about your project", short: "Details" },
] as const;

export const estimateCopy = {
  eyebrow: "Free Estimate",
  heading: "Request a Free Estimate",
  intro: "Five quick steps. We'll review your project and follow up to schedule a consultation.",
  submitLabel: "Request My Estimate",
  successTitle: "Thank you — your request is in.",
  successBody: "The Moss Landscaping team will review your project details and reach out to schedule a consultation.",
  endpoint: "/api/estimate",
} as const;

export type EstimatePayload = {
  projectType: ProjectTypeId;
  propertyType: PropertyTypeId;
  location: string;
  locationMatch: string | null;
  timeline: TimelineId;
  name: string;
  phone: string;
  email: string;
  description: string;
  source?: string;
};
