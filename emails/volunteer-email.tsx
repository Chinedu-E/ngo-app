import { EmailField } from "./components/email-field";
import { EmailLayout } from "./components/email-layout";
import type { VolunteerEmailData } from "@/lib/email/types";

export default function VolunteerEmail({
  fullName,
  email,
  phone,
  areasOfInterest,
  skills,
  availability,
  whyVolunteer,
}: VolunteerEmailData) {
  return (
    <EmailLayout
      preview={`New volunteer application from ${fullName}`}
      title="New Volunteer Application"
    >
      <EmailField label="Full Name" value={fullName} />
      <EmailField label="Email" value={email} />
      <EmailField label="Phone" value={phone} />
      <EmailField label="Areas of Interest" value={areasOfInterest} />
      <EmailField label="Skills / Experience" value={skills} />
      <EmailField label="Availability" value={availability} />
      <EmailField label="Why Volunteer" value={whyVolunteer} />
    </EmailLayout>
  );
}
