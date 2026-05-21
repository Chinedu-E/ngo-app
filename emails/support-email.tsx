import { EmailField } from "./components/email-field";
import { EmailLayout } from "./components/email-layout";
import type { SupportEmailData } from "@/lib/email/types";

export default function SupportEmail({
  fullName,
  email,
  phone,
  ageRange,
  audience,
  supportType,
  contactMethod,
  message,
  consent,
}: SupportEmailData) {
  return (
    <EmailLayout
      preview={`New support request from ${fullName}`}
      title="New Support Request"
    >
      <EmailField label="Full Name" value={fullName} />
      <EmailField label="Email" value={email} />
      <EmailField label="Phone" value={phone} />
      <EmailField label="Age Range" value={ageRange} />
      <EmailField label="Audience" value={audience} />
      <EmailField label="Support Type" value={supportType} />
      <EmailField label="Preferred Contact Method" value={contactMethod} />
      <EmailField label="Message" value={message} />
      <EmailField label="Consent Given" value={consent} />
    </EmailLayout>
  );
}
