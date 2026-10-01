/**
 * Server-side lead dispatch. Each function is a seam for a real provider;
 * in concept mode none of them send anything.
 *
 * To go live, implement one or more of these with credentials from env vars:
 *   - CRM (e.g. HubSpot / Jobber / LMN):  CRM_API_KEY
 *   - Email notification (e.g. Resend):    EMAIL_API_KEY, LEAD_NOTIFY_EMAIL
 *   - SMS notification (e.g. Twilio):      SMS_* vars
 */
import type { EstimatePayload } from "@/data/estimate";

export type Lead = EstimatePayload & { id: string; receivedAt: string };

type Dispatcher = (lead: Lead) => Promise<void>;

const sendToCrm: Dispatcher = async () => {};
const sendEmailNotification: Dispatcher = async () => {};
const sendSmsNotification: Dispatcher = async () => {};

export const dispatchers: Dispatcher[] = [sendToCrm, sendEmailNotification, sendSmsNotification];

export async function dispatchLead(lead: Lead) {
  const results = await Promise.allSettled(dispatchers.map((d) => d(lead)));
  return results.filter((r) => r.status === "rejected").length;
}
