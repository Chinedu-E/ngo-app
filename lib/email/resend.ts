import type { ReactElement } from "react";
import { Resend } from "resend";

export const EMAIL_SUBJECTS = {
  support: "Support",
  volunteer: "Volunteer",
  contact: "Contact",
  newsletter: "Newsletter",
} as const;

const DEFAULT_TEAM_INBOX = "admin@thriveparth.org";

type SendTeamNotificationOptions = {
  subject: string;
  template: ReactElement;
  replyTo?: string;
};

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function getFromEmail(): string | null {
  return process.env.RESEND_FROM_EMAIL ?? null;
}

function getTeamInbox(): string {
  return process.env.TEAM_INBOX_EMAIL ?? DEFAULT_TEAM_INBOX;
}

export async function sendTeamNotification({
  subject,
  template,
  replyTo,
}: SendTeamNotificationOptions): Promise<{ ok: true } | { ok: false; error: string }> {
  const resend = getResendClient();
  const from = getFromEmail();
  const to = getTeamInbox();

  if (!resend || !from) {
    console.error("[email] Missing RESEND_API_KEY or RESEND_FROM_EMAIL");
    return { ok: false, error: "Email service is not configured." };
  }

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: replyTo ? [replyTo] : undefined,
    subject,
    react: template,
  });

  if (error) {
    console.error("[email] Resend error:", error);
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
