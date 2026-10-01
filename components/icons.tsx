import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...p,
});

export const ArrowRight = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const ArrowLeft = (p: P) => (
  <svg {...base(p)}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);
export const Phone = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  </svg>
);
export const Mail = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);
export const MapPin = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);
export const Check = (p: P) => (
  <svg {...base(p)}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);
export const Close = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const Menu = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
);
export const Search = (p: P) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </svg>
);
export const Play = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="m10.5 9 4 3-4 3Z" fill="currentColor" />
  </svg>
);
export const Expand = (p: P) => (
  <svg {...base(p)}>
    <path d="M15 4h5v5M9 20H4v-5M20 4l-6 6M4 20l6-6" />
  </svg>
);
export const Leaf = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15Z" />
    <path d="M5 19 13 11" />
  </svg>
);
export const Shears = (p: P) => (
  <svg {...base(p)}>
    <circle cx="6" cy="17" r="3" />
    <circle cx="18" cy="17" r="3" />
    <path d="M8.2 15 18 4M15.8 15 6 4" />
  </svg>
);
export const Path = (p: P) => (
  <svg {...base(p)}>
    <path d="M8 21c0-5 8-5 8-10 0-3-2-5-4-8" />
    <path d="M4 21h4M16 21h4" />
  </svg>
);
export const Light = (p: P) => (
  <svg {...base(p)}>
    <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z" />
  </svg>
);
export const Spark = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />
  </svg>
);
export const Pencil = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 20h4L19 9l-4-4L4 16v4Z" />
    <path d="m13 7 4 4" />
  </svg>
);
export const Stones = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="4" width="8" height="6" rx="1" />
    <rect x="13" y="4" width="8" height="6" rx="1" />
    <rect x="3" y="14" width="5" height="6" rx="1" />
    <rect x="10" y="14" width="11" height="6" rx="1" />
  </svg>
);
export const Building = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 21V7l8-4 8 4v14M9 21v-5h6v5M8 10h.01M12 10h.01M16 10h.01" />
  </svg>
);
export const Home = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 11 12 4l9 7M5 10v10h14V10" />
    <path d="M10 20v-5h4v5" />
  </svg>
);
export const Clock = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
export const Drag = (p: P) => (
  <svg {...base(p)}>
    <path d="m9 7-5 5 5 5M15 7l5 5-5 5" />
  </svg>
);
