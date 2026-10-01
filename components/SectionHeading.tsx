import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  id?: string;
  className?: string;
};

export function SectionHeading({ eyebrow, title, intro, tone = "light", align = "left", id, className = "" }: Props) {
  const dark = tone === "dark";
  return (
    <div data-reveal className={`${align === "center" ? "mx-auto text-center" : ""} max-w-2xl ${className}`}>
      <p className={`eyebrow mb-4 flex items-center gap-3 ${align === "center" ? "justify-center" : ""} ${dark ? "text-ember-400" : "text-ember-700"}`}>
        <span className={`h-px w-8 ${dark ? "bg-ember-400" : "bg-ember-600"}`} />
        {eyebrow}
      </p>
      <h2 id={id} className={`font-serif text-[2.25rem] font-bold leading-[1.08] sm:text-5xl lg:text-[3.4rem] ${dark ? "text-white" : "text-navy-900"}`}>
        {title}
      </h2>
      {intro && <p className={`mt-5 text-[1.05rem] leading-relaxed ${dark ? "text-white/75" : "text-mist"}`}>{intro}</p>}
    </div>
  );
}
