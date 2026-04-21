import { getSiteUrl } from "@/lib/site";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

function getEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    return null;
  }

  return { apiKey, from };
}

export async function sendEmail(payload: EmailPayload) {
  const config = getEmailConfig();

  if (!config) {
    return { delivered: false, skipped: true as const };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: config.from,
      to: [payload.to],
      subject: payload.subject,
      html: payload.html,
      text: payload.text
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Email delivery failed: ${response.status} ${errorText}`);
  }

  return { delivered: true as const, skipped: false as const };
}

export function buildUnsubscribeUrl(email: string, token: string) {
  const url = new URL(getSiteUrl("/unsubscribe"));
  url.searchParams.set("email", email);
  url.searchParams.set("token", token);
  return url.toString();
}
