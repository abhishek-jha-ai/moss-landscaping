import Link from "next/link";

export default function NotFound() {
  return (
    <section className="grid min-h-[80svh] place-items-center bg-navy-950 px-5 pt-24 text-center text-white">
      <div>
        <p className="eyebrow text-ember-400">Page not found</p>
        <h1 className="mt-4 font-serif text-5xl font-bold">This path doesn&apos;t lead anywhere.</h1>
        <Link href="/" className="btn btn-primary mt-8">
          Back to home
        </Link>
      </div>
    </section>
  );
}
