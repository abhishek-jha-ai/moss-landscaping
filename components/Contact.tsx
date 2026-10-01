import Image from "next/image";
import { contactInfo, siteConfig } from "@/data/site";
import { estimateCopy } from "@/data/estimate";
import { EmailLink, PhoneLink } from "./ContactLinks";
import { EstimateWizard } from "./EstimateWizard";
import { ArrowRight, Clock, Mail, Phone } from "./icons";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative isolate overflow-hidden bg-navy-950 py-20 text-white md:py-28">
      <Image src="/images/fire-lounge-terrace.jpg" alt="" fill sizes="100vw" className="-z-10 object-cover opacity-25" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-950 via-navy-950/80 to-navy-950" />

      <div className="container-x grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div data-reveal className="lg:pt-6">
          <p className="eyebrow mb-4 flex items-center gap-3 text-ember-400">
            <span className="h-px w-8 bg-ember-400" /> {estimateCopy.eyebrow}
          </p>
          <h2 id="contact-heading" className="font-serif text-[2.25rem] font-bold leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
            {estimateCopy.heading}
          </h2>
          <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-white/75">{estimateCopy.intro}</p>

          <ul className="mt-10 grid gap-3">
            <li>
              <PhoneLink location="contact_section" className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-colors hover:border-ember-500/60 hover:bg-white/[0.07]">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-ember-500 text-navy-950">
                  <Phone />
                </span>
                <span className="flex-1">
                  <span className="block text-xs font-bold uppercase tracking-[0.16em] text-white/55">Call</span>
                  <span className="mt-0.5 block font-serif text-2xl font-bold">{contactInfo.phone}</span>
                </span>
                <ArrowRight className="text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-ember-400" />
              </PhoneLink>
            </li>
            <li>
              <EmailLink location="contact_section" className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-colors hover:border-ember-500/60 hover:bg-white/[0.07]">
                <span className="grid size-12 shrink-0 place-items-center rounded-full border border-white/20 text-ember-400">
                  <Mail />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold uppercase tracking-[0.16em] text-white/55">Email</span>
                  <span className="mt-0.5 block truncate text-lg font-semibold">{contactInfo.email}</span>
                </span>
                <ArrowRight className="text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-ember-400" />
              </EmailLink>
            </li>
          </ul>
          <p className="mt-6 flex items-center gap-2 text-sm text-white/60">
            <Clock width={16} height={16} /> Serving residential & commercial properties across {siteConfig.region}.
          </p>
        </div>

        <div id="estimate" data-reveal className="overflow-hidden rounded-3xl bg-ivory-50 text-navy-950 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.8)]">
          <EstimateWizard />
        </div>
      </div>
    </section>
  );
}
