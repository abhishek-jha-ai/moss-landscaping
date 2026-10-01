"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  estimateCopy,
  estimateSteps,
  projectTypes,
  propertyTypes,
  timelines,
  type EstimatePayload,
  type ProjectTypeId,
  type PropertyTypeId,
  type TimelineId,
} from "@/data/estimate";
import { stateAbbr } from "@/data/serviceAreas";
import { trackEvent } from "@/lib/analytics";
import { on } from "@/lib/events";
import { findArea, matchServiceArea, suggestServiceAreas } from "@/lib/serviceAreas";
import { PhoneLink } from "./ContactLinks";
import { ArrowLeft, ArrowRight, Check, MapPin } from "./icons";

type Form = {
  projectType: ProjectTypeId | null;
  propertyType: PropertyTypeId | null;
  location: string;
  timeline: TimelineId | null;
  name: string;
  phone: string;
  email: string;
  description: string;
};

const empty: Form = { projectType: null, propertyType: null, location: "", timeline: null, name: "", phone: "", email: "", description: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function formatPhone(v: string) {
  const d = v.replace(/\D/g, "").replace(/^1/, "").slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

function firstIncomplete(f: Form) {
  if (!f.projectType) return 0;
  if (!f.propertyType) return 1;
  if (!f.location.trim()) return 2;
  if (!f.timeline) return 3;
  return 4;
}

export function EstimateWizard() {
  const [form, setForm] = useState<Form>(empty);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [refId, setRefId] = useState("");
  const [locFocus, setLocFocus] = useState(false);
  const started = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const userNavigated = useRef(false);

  const markStarted = (source: string) => {
    if (started.current) return;
    started.current = true;
    trackEvent("estimate_started", { source });
  };

  const goTo = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
    userNavigated.current = true;
  };

  // Focus the step heading after navigation for screen-reader + keyboard users
  useEffect(() => {
    if (userNavigated.current) headingRef.current?.focus({ preventScroll: true });
  }, [step, status]);

  const formRef = useRef(form);
  useEffect(() => {
    formRef.current = form;
  }, [form]);

  useEffect(
    () =>
      on("moss:estimate-prefill", (p) => {
        const defined = Object.fromEntries(Object.entries(p).filter(([, v]) => v)) as Partial<Form>;
        const next = { ...formRef.current, ...defined };
        setStatus((s) => (s === "success" ? "idle" : s));
        setForm(next);
        setDir(1);
        setStep(firstIncomplete(next));
        markStarted("prefill");
      }),
    [],
  );

  // Town pages link to /?town=<slug>#estimate
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("town");
    const area = slug ? findArea(slug) : undefined;
    if (!area) return;
    const raf = requestAnimationFrame(() => setForm((f) => ({ ...f, location: `${area.name}, ${stateAbbr}` })));
    return () => cancelAnimationFrame(raf);
  }, []);

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    markStarted("wizard");
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const choose = <K extends "projectType" | "propertyType" | "timeline">(key: K, value: Form[K]) => {
    set(key, value);
    if (key === "projectType") trackEvent("service_selected", { service: value as string, action: "estimate_wizard" });
    window.setTimeout(() => goTo(Math.min(step + 1, 4)), 220);
  };

  const match = matchServiceArea(form.location);
  const locSuggestions = locFocus && match.status !== "match" ? suggestServiceAreas(form.location, 4) : [];

  const validateLocation = () => {
    if (!form.location.trim()) {
      setErrors((e) => ({ ...e, location: "Please enter the town or ZIP code of the property." }));
      return false;
    }
    trackEvent("service_area_checked", { query: form.location, result: match.status, via: "estimate_wizard" });
    return true;
  };

  const validateDetails = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (form.phone.replace(/\D/g, "").length < 10) e.phone = "Please enter a 10-digit phone number.";
    if (!EMAIL_RE.test(form.email.trim())) e.email = "Please enter a valid email address.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (step < 4) return;
    if (!validateDetails()) return;
    setStatus("submitting");
    const payload: EstimatePayload = {
      projectType: form.projectType!,
      propertyType: form.propertyType!,
      location: form.location.trim(),
      locationMatch: match.status === "match" ? match.area.name : null,
      timeline: form.timeline!,
      name: form.name.trim(),
      phone: form.phone,
      email: form.email.trim(),
      description: form.description.trim(),
      source: typeof window !== "undefined" ? window.location.pathname : undefined,
    };
    try {
      const res = await fetch(estimateCopy.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error("Request failed");
      setRefId(data.id);
      setStatus("success");
      userNavigated.current = true;
      trackEvent("estimate_submitted", { project_type: payload.projectType, property_type: payload.propertyType, in_area: !!payload.locationMatch, timeline: payload.timeline });
    } catch {
      setStatus("error");
    }
  };

  const labelOf = (list: readonly { id: string; label: string }[], id: string | null) => list.find((x) => x.id === id)?.label ?? "";

  const reset = () => {
    setForm(empty);
    setStep(0);
    setStatus("idle");
    started.current = false;
  };

  if (status === "success") {
    return (
      <div className="p-6 md:p-10" aria-live="polite">
        <motion.span
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="grid size-16 place-items-center rounded-full bg-forest-700 text-white"
        >
          <Check width={32} height={32} />
        </motion.span>
        <h3 ref={headingRef} tabIndex={-1} className="mt-6 font-serif text-3xl font-bold text-navy-900 focus:outline-none">
          {estimateCopy.successTitle}
        </h3>
        <p className="mt-3 leading-relaxed text-mist">{estimateCopy.successBody}</p>
        <dl className="mt-7 grid gap-x-6 gap-y-3 rounded-2xl bg-ivory-100 p-5 text-sm sm:grid-cols-2">
          {[
            ["Project", labelOf(projectTypes, form.projectType)],
            ["Property", labelOf(propertyTypes, form.propertyType)],
            ["Location", form.location],
            ["Timeline", labelOf(timelines, form.timeline)],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-mist">{k}</dt>
              <dd className="mt-0.5 font-semibold text-navy-900">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 text-xs text-mist">Reference {refId}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <PhoneLink location="estimate_success" className="btn btn-dark">
            Prefer to talk? Call now
          </PhoneLink>
          <button type="button" onClick={reset} className="btn btn-outline-dark">
            Start another request
          </button>
        </div>
      </div>
    );
  }

  const current = estimateSteps[step];

  return (
    <form onSubmit={submit} noValidate className="flex h-full flex-col p-5 sm:p-7 md:p-9">
      {/* progress */}
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.16em] text-mist">
        <span>
          Step {step + 1} of {estimateSteps.length}
        </span>
        <span className="text-ember-700">{current.short}</span>
      </div>
      <div className="mt-3 grid grid-cols-5 gap-1.5" aria-hidden>
        {estimateSteps.map((s, i) => (
          <span key={s.id} className="h-1.5 overflow-hidden rounded-full bg-ivory-300">
            <motion.span className="block h-full bg-ember-500" initial={false} animate={{ width: i <= step ? "100%" : "0%" }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} />
          </span>
        ))}
      </div>

      <div className="relative mt-7 flex-1">
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.fieldset
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -28 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="min-w-0"
          >
            <legend className="contents">
              <h3 id="est-step-title" ref={headingRef} tabIndex={-1} className="font-serif text-[1.65rem] font-bold leading-tight text-navy-900 focus:outline-none md:text-3xl">
                {current.title}
              </h3>
            </legend>

            {step === 0 && <Options name="projectType" options={projectTypes} value={form.projectType} onChoose={(v) => choose("projectType", v)} cols="sm:grid-cols-2" />}
            {step === 1 && <Options name="propertyType" options={propertyTypes} value={form.propertyType} onChoose={(v) => choose("propertyType", v)} cols="grid-cols-2" />}
            {step === 3 && <Options name="timeline" options={timelines} value={form.timeline} onChoose={(v) => choose("timeline", v)} cols="grid-cols-2" />}

            {step === 2 && (
              <div className="mt-6">
                <label htmlFor="est-location" className="text-sm font-bold text-navy-800">
                  Town or ZIP code
                </label>
                <div className="relative mt-2">
                  <MapPin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mist" />
                  <input
                    id="est-location"
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                    onFocus={() => setLocFocus(true)}
                    onBlur={() => setTimeout(() => setLocFocus(false), 120)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (validateLocation()) goTo(3);
                      }
                    }}
                    autoComplete="address-level2"
                    placeholder="e.g. Summit or 07901"
                    aria-invalid={!!errors.location}
                    aria-describedby="est-location-status"
                    className={`w-full rounded-xl border bg-white py-4 pl-12 pr-4 text-base font-semibold text-navy-950 placeholder:font-medium placeholder:text-mist/70 focus:border-navy-900 focus:outline-none ${errors.location ? "border-red-600" : "border-ivory-300"}`}
                  />
                  {locSuggestions.length > 0 && form.location.trim() && (
                    <ul className="absolute inset-x-0 top-full z-10 mt-1.5 overflow-hidden rounded-xl border border-ivory-300 bg-white shadow-xl">
                      {locSuggestions.map((a) => (
                        <li key={a.slug}>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              set("location", `${a.name}, ${stateAbbr}`);
                              setLocFocus(false);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-3 text-left font-semibold text-navy-900 hover:bg-ivory-100"
                          >
                            <MapPin width={16} height={16} className="text-ember-600" /> {a.name}, {stateAbbr}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div id="est-location-status" aria-live="polite" className="mt-3 min-h-[1.5rem] text-sm">
                  {errors.location ? (
                    <p className="font-semibold text-red-700">{errors.location}</p>
                  ) : match.status === "match" ? (
                    <p className="flex items-center gap-2 font-semibold text-forest-700">
                      <Check width={16} height={16} /> Great — {match.area.name} is in our service area.
                    </p>
                  ) : match.status === "unknown" && !locFocus ? (
                    <p className="text-mist">Not on our listed areas — we&apos;ll confirm coverage when we follow up.</p>
                  ) : null}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field id="est-name" label="Name" error={errors.name} className="sm:col-span-2">
                  <input id="est-name" value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" aria-invalid={!!errors.name} className={inputCls(errors.name)} />
                </Field>
                <Field id="est-phone" label="Phone" error={errors.phone}>
                  <input
                    id="est-phone"
                    type="tel"
                    inputMode="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", formatPhone(e.target.value))}
                    autoComplete="tel-national"
                    aria-invalid={!!errors.phone}
                    className={inputCls(errors.phone)}
                  />
                </Field>
                <Field id="est-email" label="Email" error={errors.email}>
                  <input
                    id="est-email"
                    type="email"
                    inputMode="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    className={inputCls(errors.email)}
                  />
                </Field>
                <Field id="est-desc" label="Project description" optional className="sm:col-span-2">
                  <textarea
                    id="est-desc"
                    rows={4}
                    maxLength={4000}
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="What would you like to create? Size, ideas, anything that helps."
                    className={`${inputCls()} resize-none`}
                  />
                </Field>
              </div>
            )}
          </motion.fieldset>
        </AnimatePresence>
      </div>

      {status === "error" && (
        <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-800">
          Something went wrong sending your request. Please try again or call <PhoneLink location="estimate_error" className="underline" />.
        </p>
      )}

      <div className="mt-8 flex items-center justify-between gap-3 border-t border-ivory-300 pt-5">
        <button
          type="button"
          onClick={() => goTo(Math.max(0, step - 1))}
          className={`link-arrow text-sm text-navy-800 hover:text-ember-700 ${step === 0 ? "invisible" : ""}`}
        >
          <ArrowLeft width={16} height={16} /> Back
        </button>
        {step === 2 && (
          <button type="button" onClick={() => validateLocation() && goTo(3)} className="btn btn-dark">
            Continue <ArrowRight width={18} height={18} />
          </button>
        )}
        {step === 4 && (
          <button type="submit" disabled={status === "submitting"} className="btn btn-primary disabled:opacity-70">
            {status === "submitting" ? "Sending…" : estimateCopy.submitLabel}
            {status !== "submitting" && <ArrowRight width={18} height={18} />}
          </button>
        )}
        {(step === 0 || step === 1 || step === 3) && (
          <button
            type="button"
            onClick={() => goTo(step + 1)}
            disabled={!(step === 0 ? form.projectType : step === 1 ? form.propertyType : form.timeline)}
            className="btn btn-dark disabled:pointer-events-none disabled:opacity-30"
          >
            Next <ArrowRight width={18} height={18} />
          </button>
        )}
      </div>
    </form>
  );
}

const inputCls = (err?: string) =>
  `w-full rounded-xl border bg-white px-4 py-3.5 text-base text-navy-950 placeholder:text-mist/60 focus:border-navy-900 focus:outline-none ${err ? "border-red-600" : "border-ivory-300"}`;

function Field({ id, label, error, optional, className = "", children }: { id: string; label: string; error?: string; optional?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-sm font-bold text-navy-800">
        {label}
        {optional && <span className="text-xs font-medium text-mist">Optional</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-sm font-semibold text-red-700">{error}</p>}
    </div>
  );
}

function Options<T extends string>({
  name,
  options,
  value,
  onChoose,
  cols,
}: {
  name: string;
  options: readonly { id: T; label: string }[];
  value: T | null;
  onChoose: (v: T) => void;
  cols: string;
}) {
  return (
    <div role="radiogroup" aria-labelledby="est-step-title" data-name={name} className={`mt-6 grid gap-2.5 ${cols}`}>
      {options.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChoose(o.id)}
            className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-4 text-left text-[0.95rem] font-bold transition-all ${
              active ? "border-navy-900 bg-navy-900 text-white shadow-lg" : "border-ivory-300 bg-white text-navy-900 hover:border-navy-800 hover:shadow-md"
            }`}
          >
            {o.label}
            <span className={`grid size-5 shrink-0 place-items-center rounded-full border ${active ? "border-ember-500 bg-ember-500 text-navy-950" : "border-ivory-300"}`}>
              {active && <Check width={12} height={12} strokeWidth={3} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
