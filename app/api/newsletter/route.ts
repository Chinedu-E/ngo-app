import { createElement } from "react";
import { NextResponse } from "next/server";
import NewsletterEmail from "@/emails/newsletter-email";
import { EMAIL_SUBJECTS, sendTeamNotification } from "@/lib/email/resend";
import type { NewsletterEmailData } from "@/lib/email/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.email) {
      return NextResponse.json(
        { success: false, message: "Please enter your email address." },
        { status: 400 },
      );
    }

    const data: NewsletterEmailData = {
      email: String(body.email),
    };

    const result = await sendTeamNotification({
      subject: EMAIL_SUBJECTS.newsletter,
      template: createElement(NewsletterEmail, data),
      replyTo: data.email,
    });

    if (!result.ok) {
      return NextResponse.json(
        { success: false, message: "Unable to process your request." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "You are subscribed. Watch your inbox for updates from ThriveParth.",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to process your request." },
      { status: 500 },
    );
  }
}
