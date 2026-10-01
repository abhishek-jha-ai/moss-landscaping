import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { serviceAreas, stateAbbr } from "@/data/serviceAreas";
import { services } from "@/data/services";
import { contactInfo, seoMetadata, siteConfig } from "@/data/site";
import { findArea, regionLabel } from "@/lib/serviceAreas";
import { PhoneLink } from "@/components/ContactLinks";
import { ArrowRight, Check, Phone } from "@/components/icons";

export const dynamicParams = false;

export function generateStaticParams() {
  return serviceAreas.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/service-areas/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const area = findArea(slug);
  if (!area) return {};
  const title = `Landscaping in ${area.name}, ${stateAbbr}`;
  const description = `Landscape design, hardscape installation, patios, retaining walls and outdoor living spaces in ${area.name}, ${stateAbbr}. Request a free estimate from ${siteConfig.name}.`;
  const url = `${siteConfig.url}/service-areas/${area.slug}`;
  const image = `${siteConfig.url}${seoMetadata.ogImage.path}`;
  return {
    title,
    description,
    alternates: { canonical: `/service-areas/${area.slug}` },
    openGraph: {
      type: "website",
      url,
      siteName: siteConfig.name,
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [{ url: image, width: seoMetadata.ogImage.width, height: seoMetadata.ogImage.height, alt: seoMetadata.ogImage.alt }],
    },
    twitter: { card: "summary_large_image", title: `${title} | ${siteConfig.name}`, description, images: [image] },
  };
}

export default async function ServiceAreaPage({ params }: PageProps<"/service-areas/[slug]">) {
  const { slug } = await params;
  const area = findArea(slug);
  if (!area) notFound();
  const region = regionLabel(area.region);
  const nearby = serviceAreas.filter((a) => a.region === area.region && a.slug !== area.slug);
  const estimateHref = `/?town=${area.slug}#estimate`;

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy-950 pb-16 pt-36 text-white md:pb-24 md:pt-44">
        <Image src="/images/lit-steps-pavilion.jpg" alt="" fill preload sizes="100vw" className="-z-10 object-cover opacity-45" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/80 to-navy-950/30" />
        <div className="container-x">
          <nav aria-label="Breadcrumb" className="text-sm text-white/60">
            <Link href="/" className="hover:text-white">Home</Link> <span className="px-1.5">/</span>
            <Link href="/#service-areas" className="hover:text-white">Service Areas</Link> <span className="px-1.5">/</span>
            <span className="text-white/90">{area.name}</span>
          </nav>
          <p className="eyebrow mt-8 flex items-center gap-3 text-ember-400">
            <span className="h-px w-8 bg-ember-400" /> {region}
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-[2.6rem] font-bold leading-[1.05] sm:text-6xl">
            Landscaping in <span className="italic text-ember-400">{area.name}</span>, {stateAbbr}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
            Landscape design, hardscapes and outdoor living spaces for homes and properties in {area.name} and across {region} — from {siteConfig.legalName}, with more
            than {siteConfig.yearsInBusiness} years of experience in {siteConfig.region}.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={estimateHref} className="btn btn-primary">
              Request an Estimate <ArrowRight width={18} height={18} />
            </Link>
            <PhoneLink location={`town_${area.slug}`} className="btn btn-ghost-light">
              <Phone width={18} height={18} /> {contactInfo.phone}
            </PhoneLink>
          </div>
        </div>
      </section>

      <section className="bg-ivory-100 py-16 md:py-24">
        <div className="container-x">
          <h2 className="font-serif text-3xl font-bold text-navy-900 md:text-4xl">Services in {area.name}</h2>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li key={s.id} className="overflow-hidden rounded-2xl bg-ivory-50 shadow-[0_20px_40px_-30px_rgba(10,18,25,0.5)]">
                <div className="relative aspect-[16/10]">
                  <Image src={s.image} alt={s.imageAlt} fill sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 100vw" className="object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-xl font-bold text-navy-900">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{s.summary}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-forest-950 py-16 text-white md:py-20">
        <div className="container-x grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="flex items-center gap-3 font-serif text-2xl font-bold">
              <span className="grid size-10 place-items-center rounded-full bg-forest-700"><Check width={20} height={20} /></span>
              {area.name} is in our service area.
            </p>
            {nearby.length > 0 && (
              <>
                <p className="mt-6 text-sm font-bold uppercase tracking-[0.16em] text-ember-400">Also serving nearby</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {nearby.map((a) => (
                    <li key={a.slug}>
                      <Link href={`/service-areas/${a.slug}`} className="inline-block rounded-full border border-white/20 px-3 py-1.5 text-sm font-semibold text-white/85 hover:border-white/50">
                        {a.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div className="rounded-3xl bg-white/[0.06] p-7 md:p-9">
            <p className="font-serif text-3xl font-bold">Planning a project in {area.name}?</p>
            <p className="mt-3 text-white/75">Tell us about your property — it takes about a minute.</p>
            <Link href={estimateHref} className="btn btn-primary mt-6">
              Get a Free Estimate <ArrowRight width={18} height={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
