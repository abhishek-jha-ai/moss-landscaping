"use client";

import Link from "next/link";
import { siteConfig } from "@/data/site";
import { PhoneLink } from "./ContactLinks";
import { ArrowRight, Phone } from "./icons";

export function MobileStickyCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-navy-950/95 px-3 pt-2.5 backdrop-blur-md md:hidden" style={{ paddingBottom: "max(0.625rem, env(safe-area-inset-bottom))" }}>
      <div className="grid grid-cols-[1fr_1.5fr] gap-2">
        <PhoneLink location="mobile_sticky" className="btn !py-3.5 border border-white/25 text-white" aria-label="Call Moss Landscaping">
          <Phone width={18} height={18} /> Call
        </PhoneLink>
        <Link href={siteConfig.estimateHref} className="btn btn-primary !py-3.5">
          Get Estimate <ArrowRight width={18} height={18} />
        </Link>
      </div>
    </div>
  );
}
