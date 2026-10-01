import { NextResponse } from "next/server";
import { projectTypes, propertyTypes, timelines, type EstimatePayload } from "@/data/estimate";
import { siteConfig } from "@/data/site";
import { dispatchLead } from "@/lib/integrations";
import { matchServiceArea } from "@/lib/serviceAreas";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(body: Partial<EstimatePayload>): string[] {
  const errors: string[] = [];
  if (!projectTypes.some((p) => p.id === body.projectType)) errors.push("projectType");
  if (!propertyTypes.some((p) => p.id === body.propertyType)) errors.push("propertyType");
  if (!timelines.some((t) => t.id === body.timeline)) errors.push("timeline");
  if (!body.location?.trim()) errors.push("location");
  if (!body.name?.trim() || body.name.length > 120) errors.push("name");
  if ((body.phone ?? "").replace(/\D/g, "").length < 10) errors.push("phone");
  if (!EMAIL_RE.test(body.email ?? "")) errors.push("email");
  if ((body.description ?? "").length > 4000) errors.push("description");
  return errors;
}

export async function POST(req: Request) {
  let body: Partial<EstimatePayload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const errors = validate(body);
  if (errors.length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const match = matchServiceArea(body.location!);
  const lead = {
    ...(body as EstimatePayload),
    locationMatch: match.status === "match" ? match.area.name : null,
    id: `ML-${Date.now().toString(36).toUpperCase()}`,
    receivedAt: new Date().toISOString(),
  };

  if (!siteConfig.conceptMode) {
    await dispatchLead(lead);
  }

  return NextResponse.json({ ok: true, id: lead.id, demo: siteConfig.conceptMode });
}
