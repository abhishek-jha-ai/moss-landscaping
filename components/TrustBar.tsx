import { siteConfig } from "@/data/site";
import { Building, Pencil, Stones } from "./icons";

const points = [
  { label: "Custom Design", Icon: Pencil },
  { label: "Expert Installation", Icon: Stones },
  { label: "Residential & Commercial", Icon: Building },
];

/** Compact trust row anchored to the bottom of the hero. */
export function TrustBar() {
  return (
    <div className="hero-rise border-t border-white/12 bg-navy-950/55 backdrop-blur-md" style={{ ["--d" as string]: "700ms" }}>
      <ul className="container-x grid grid-cols-2 gap-x-4 gap-y-3 py-4 text-white sm:flex sm:items-center sm:justify-between sm:gap-6 md:py-5">
        <li className="col-span-2 flex items-baseline gap-2 sm:col-span-1">
          <span className="font-serif text-3xl font-bold text-ember-400 md:text-4xl">{siteConfig.yearsInBusiness}+</span>
          <span className="text-sm font-semibold leading-tight text-white/85">
            Years serving
            <br className="hidden sm:block" /> New Jersey
          </span>
        </li>
        {points.map(({ label, Icon }) => (
          <li key={label} className="flex items-center gap-2.5 text-[0.8rem] font-semibold text-white/90 sm:text-sm">
            <span className="grid size-8 shrink-0 place-items-center rounded-full border border-white/20 text-ember-400 md:size-9">
              <Icon width={16} height={16} />
            </span>
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
