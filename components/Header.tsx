"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { contactInfo, siteConfig } from "@/data/site";
import { Logo } from "./Logo";
import { ArrowRight, Close, Mail, Menu, Phone } from "./icons";
import { EmailLink, PhoneLink } from "./ContactLinks";

const sectionIds = siteConfig.nav.map((n) => n.href.split("#")[1]);

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolledState, setScrolled] = useState(false);
  const scrolled = !isHome || scrolledState;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("top");

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Highlight the nav item for the section currently in view
  useEffect(() => {
    if (!isHome) return;
    const els = sectionIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [isHome]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || open;

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
        solid ? "bg-navy-950/92 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] backdrop-blur-md" : "bg-gradient-to-b from-navy-950/70 to-transparent"
      }`}
    >
      <div className={`container-x flex items-center justify-between transition-[height] duration-500 ${scrolled ? "h-[4.25rem]" : "h-[4.75rem] md:h-[5.5rem]"}`}>
        <Link href="/#top" aria-label={`${siteConfig.name} — home`} onClick={() => setOpen(false)} className="shrink-0">
          <Logo compact={scrolled} />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1 xl:gap-2">
            {siteConfig.nav.map((item) => {
              const id = item.href.split("#")[1];
              const isActive = isHome && active === id;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative px-3 py-2 text-[0.9rem] font-semibold transition-colors ${isActive ? "text-ember-400" : "text-white/85 hover:text-white"}`}
                  >
                    {item.label}
                    <span
                      className={`absolute inset-x-3 -bottom-0.5 h-px origin-left bg-ember-400 transition-transform duration-500 ${isActive ? "scale-x-100" : "scale-x-0"}`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <PhoneLink location="header" className="hidden xl:inline-flex items-center gap-2 px-3 text-sm font-semibold text-white/85 hover:text-white">
            <Phone width={16} height={16} /> {contactInfo.phone}
          </PhoneLink>
          <Link href={siteConfig.estimateHref} className="btn btn-primary hidden sm:inline-flex !py-3 !px-5 text-sm">
            Get a Free Estimate <ArrowRight width={16} height={16} />
          </Link>
          <button
            type="button"
            className="lg:hidden -mr-2 grid size-11 place-items-center rounded-full text-white hover:bg-white/10"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <Close width={24} height={24} /> : <Menu width={24} height={24} />}
          </button>
        </div>
      </div>

    </header>

    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={`lg:hidden fixed inset-x-0 bottom-0 z-50 overflow-y-auto bg-navy-950 pb-28 ${scrolled ? "top-[4.25rem]" : "top-[4.75rem] md:top-[5.5rem]"}`}
        >
          <nav aria-label="Mobile" className="container-x pt-6">
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {siteConfig.nav.map((item, i) => (
                <motion.li key={item.href} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i + 0.05 }}>
                  <Link href={item.href} onClick={() => setOpen(false)} className="flex items-center justify-between py-4 font-serif text-2xl text-white">
                    {item.label}
                    <ArrowRight className="text-ember-500" />
                  </Link>
                </motion.li>
              ))}
            </ul>
            <Link href={siteConfig.estimateHref} onClick={() => setOpen(false)} className="btn btn-primary mt-8 w-full">
              Get a Free Estimate <ArrowRight width={18} height={18} />
            </Link>
            <div className="mt-8 grid gap-3 text-white/80">
              <PhoneLink location="mobile_menu" className="flex items-center gap-3 text-lg">
                <Phone className="text-ember-500" /> {contactInfo.phone}
              </PhoneLink>
              <EmailLink location="mobile_menu" className="flex items-center gap-3 text-lg">
                <Mail className="text-ember-500" /> {contactInfo.email}
              </EmailLink>
            </div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
