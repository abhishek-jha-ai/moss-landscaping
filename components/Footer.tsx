import Link from "next/link";
import { contactInfo, siteConfig } from "@/data/site";
import { services } from "@/data/services";
import { serviceAreas, stateAbbr } from "@/data/serviceAreas";
import { EmailLink, PhoneLink } from "./ContactLinks";
import { Logo } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-navy-950 pb-28 pt-16 text-white/75 md:pb-10">
      <div className="container-x">
        <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed">
              Landscape design, hardscapes and outdoor living for residential and commercial properties across {siteConfig.region}.
            </p>
            <Link href={siteConfig.estimateHref} className="btn btn-primary mt-6 !py-3 text-sm">
              Get a Free Estimate
            </Link>
          </div>
          <nav aria-label="Footer">
            <p className="eyebrow mb-4 text-white">Explore</p>
            <ul className="grid gap-2.5 text-sm">
              {siteConfig.nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="hover:text-ember-400">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="eyebrow mb-4 text-white">Services</p>
            <ul className="grid gap-2.5 text-sm">
              {services.map((s) => (
                <li key={s.id}>
                  <Link href="/#services" className="hover:text-ember-400">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4 text-white">Contact</p>
            <ul className="grid gap-2.5 text-sm">
              <li>
                <PhoneLink location="footer" className="text-lg font-semibold text-white hover:text-ember-400" />
              </li>
              <li>
                <EmailLink location="footer" className="hover:text-ember-400" />
              </li>
              <li>
                <a href={contactInfo.websiteUrl} className="hover:text-ember-400" rel="noopener">
                  {contactInfo.website}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-b border-white/10 py-8">
          <p className="eyebrow mb-4 text-white">Service Areas</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {serviceAreas.map((a) => (
              <li key={a.slug}>
                <Link href={`/service-areas/${a.slug}`} className="hover:text-ember-400">
                  {a.name}, {stateAbbr}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2 pt-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {siteConfig.legalName}. All rights reserved.
          </p>
          {siteConfig.conceptMode && <p className="tracking-wide">{siteConfig.conceptLabel}</p>}
        </div>
      </div>
    </footer>
  );
}
