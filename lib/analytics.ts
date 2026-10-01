/**
 * Single analytics entry point. Every interaction tracked on the site goes
 * through trackEvent so a provider (GA4, Vercel Analytics, Meta Pixel, a CRM)
 * can be plugged in here without touching components.
 */

export type AnalyticsEvent =
  | "estimate_started"
  | "service_selected"
  | "service_area_checked"
  | "project_viewed"
  | "before_after_used"
  | "estimate_submitted"
  | "phone_clicked"
  | "email_clicked";

type Props = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(event: AnalyticsEvent, props: Props = {}) {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...props });
    window.gtag?.("event", event, props);
    if (process.env.NODE_ENV !== "production") console.debug("[analytics]", event, props);
  } catch {
    // analytics must never break the UI
  }
}
