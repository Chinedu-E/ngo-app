import { createElement } from "react";
import { NextResponse } from "next/server";
import ContactEmail from "@/emails/contact-email";
import { EMAIL_SUBJECTS, sendTeamNotification } from "@/lib/email/resend";
import type { ContactEmailData } from "@/lib/email/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.fullName || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { success: false, message: "Please complete all required fields." },
        { status: 400 },
      );
    }

    const data: ContactEmailData = {
      fullName: String(body.fullName),
      email: String(body.email),
      subject: String(body.subject),
      message: String(body.message),
    };

    const result = await sendTeamNotification({
      subject: EMAIL_SUBJECTS.contact,
      template: createElement(ContactEmail, data),
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
      message: "Thank you for contacting ThriveParth. We will get back to you soon.",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to process your request." },
      { status: 500 },
    );
  }
}
