import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

export const resendClient = apiKey ? new Resend(apiKey) : null;

// lib/resend.ts

export async function sendAlertEmail({
  to,
  keyword,
  frequency,
  jobTitles = [],
}: {
  to: string;
  keyword: string;
  frequency: "daily" | "weekly";
  jobTitles?: string[];
}) {
  if (!resendClient) return;

  const subject =
    frequency === "daily"
      ? `New remote jobs for "${keyword}" (daily alert)`
      : `New remote jobs for "${keyword}" (weekly alert)`;

  const listHtml =
    jobTitles.length > 0
      ? `<ul>${jobTitles.map((t) => `<li>${t}</li>`).join("")}</ul>`
      : "<p>No new jobs today, but we’ll keep watching.</p>";

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Your ${frequency} alert for "${keyword}"</h2>
      <p>Here are some recent matching jobs:</p>
      ${listHtml}
      <p style="color:#666;">Thanks for using WorkIsWork.</p>
    </div>
  `;

  await resendClient.emails.send({
    from: "alerts@workiswork.dev",
    to,
    subject,
    html,
  });
}

