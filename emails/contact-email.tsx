import { EmailField } from "./components/email-field";
import { EmailLayout } from "./components/email-layout";
import type { ContactEmailData } from "@/lib/email/types";

export default function ContactEmail({
  fullName,
  email,
  subject,
  message,
}: ContactEmailData) {
  return (
    <EmailLayout
      preview={`New contact message from ${fullName}: ${subject}`}
      title="New Contact Message"
    >
      <EmailField label="Full Name" value={fullName} />
      <EmailField label="Email" value={email} />
      <EmailField label="Subject" value={subject} />
      <EmailField label="Message" value={message} />
    </EmailLayout>
  );
}
