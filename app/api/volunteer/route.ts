import { createElement } from "react";
import { NextResponse } from "next/server";
import VolunteerEmail from "@/emails/volunteer-email";
import { EMAIL_SUBJECTS, sendTeamNotification } from "@/lib/email/resend";
import type { VolunteerEmailData } from "@/lib/email/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.fullName || !body.email || !body.areasOfInterest || !body.whyVolunteer) {
      return NextResponse.json(
        { success: false, message: "Please complete all required fields." },
        { status: 400 },
      );
    }

    const data: VolunteerEmailData = {
      fullName: String(body.fullName),
      email: String(body.email),
      phone: String(body.phone ?? ""),
      areasOfInterest: String(body.areasOfInterest),
      skills: String(body.skills ?? ""),
      availability: String(body.availability ?? ""),
      whyVolunteer: String(body.whyVolunteer),
    };

    const result = await sendTeamNotification({
      subject: EMAIL_SUBJECTS.volunteer,
      template: createElement(VolunteerEmail, data),
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
        "Thank you for your interest in volunteering with ThriveParth. Our team will review your submission and contact you soon.",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to process your request." },
      { status: 500 },
    );
  }
}
