import type { Metadata, Viewport } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileStickyCTA } from "@/components/MobileStickyCTA";
import { RevealObserver } from "@/components/Reveal";
import { seoMetadata, siteConfig } from "@/data/site";
import { businessJsonLd } from "@/lib/structuredData";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const ogImageUrl = `${siteConfig.url}${seoMetadata.ogImage.path}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: seoMetadata.title, template: seoMetadata.titleTemplate },
  description: seoMetadata.description,
  keywords: [...seoMetadata.keywords],
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.legalName }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: seoMetadata.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: seoMetadata.shortTitle,
    description: seoMetadata.ogDescription,
    images: [
      {
        url: ogImageUrl,
        secureUrl: ogImageUrl,
        width: seoMetadata.ogImage.width,
        height: seoMetadata.ogImage.height,
        alt: seoMetadata.ogImage.alt,
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoMetadata.shortTitle,
    description: seoMetadata.ogDescription,
    images: [{ url: ogImageUrl, alt: seoMetadata.ogImage.alt }],
  },
  // Concept builds stay out of search results so they never compete with the live site.
  robots: siteConfig.conceptMode ? { index: false, follow: false } : { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: seoMetadata.themeColor,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${playfair.variable} ${manrope.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* enables scroll-reveal styles only when JS runs, so content is never hidden without it */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-navy-950">
          Skip to content
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd()) }} />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileStickyCTA />
        <RevealObserver />
      </body>
    </html>
  );
}
