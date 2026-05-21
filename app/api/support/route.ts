import { createElement } from "react";
import { NextResponse } from "next/server";
import SupportEmail from "@/emails/support-email";
import { EMAIL_SUBJECTS, sendTeamNotification } from "@/lib/email/resend";
import type { SupportEmailData } from "@/lib/email/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.fullName || !body.email || !body.supportType || !body.consent) {
      return NextResponse.json(
        { success: false, message: "Please complete all required fields." },
        { status: 400 },
      );
    }

    const data: SupportEmailData = {
      fullName: String(body.fullName),
      email: String(body.email),
      phone: body.phone ? String(body.phone) : undefined,
      ageRange: body.ageRange ? String(body.ageRange) : undefined,
      audience: body.audience ? String(body.audience) : undefined,
      supportType: String(body.supportType),
      contactMethod: String(body.contactMethod ?? ""),
      message: String(body.message ?? ""),
      consent: Boolean(body.consent),
    };

    const result = await sendTeamNotification({
      subject: EMAIL_SUBJECTS.support,
      template: createElement(SupportEmail, data),
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
      message:
        "Thank you for reaching out to ThriveParth. A member of our team will contact you shortly.",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to process your request." },
      { status: 500 },
    );
  }
}
