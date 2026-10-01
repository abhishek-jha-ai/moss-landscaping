"use client";

import type { ReactNode } from "react";
import { contactInfo } from "@/data/site";
import { trackEvent } from "@/lib/analytics";

type Props = { className?: string; children?: ReactNode; location: string; "aria-label"?: string };

export function PhoneLink({ className, children, location, ...rest }: Props) {
  return (
    <a href={contactInfo.phoneHref} className={className} onClick={() => trackEvent("phone_clicked", { location })} {...rest}>
      {children ?? contactInfo.phone}
    </a>
  );
}

export function EmailLink({ className, children, location, ...rest }: Props) {
  return (
    <a href={contactInfo.emailHref} className={className} onClick={() => trackEvent("email_clicked", { location })} {...rest}>
      {children ?? contactInfo.email}
    </a>
  );
}
