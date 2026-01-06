import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

export const resendClient = apiKey ? new Resend(apiKey) : null;

export async function sendAlertEmail({
  to,
  keyword,
  frequency,
}: {
  to: string;
  keyword: string;
  frequency: "daily" | "weekly";
}) {
  if (!resendClient) return;

  const subject =
    frequency === "daily"
      ? `Daily alert saved for "${keyword}"`
      : `Weekly alert saved for "${keyword}"`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2 style="margin: 0 0 8px 0;">Your alert is set!</h2>
      <p>We&apos;ll email you ${frequency} when new remote jobs match:</p>
      <p><strong>Keyword:</strong> ${keyword}</p>
      <p style="color: #555;">Thanks for using WorkIsWork.</p>
    </div>
  `;

  await resendClient.emails.send({
    from: "alerts@workiswork.dev",
    to,
    subject,
    html,
  });
}


