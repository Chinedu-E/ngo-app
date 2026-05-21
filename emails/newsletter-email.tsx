import { EmailField } from "./components/email-field";
import { EmailLayout } from "./components/email-layout";
import type { NewsletterEmailData } from "@/lib/email/types";

export default function NewsletterEmail({ email }: NewsletterEmailData) {
  return (
    <EmailLayout
      preview={`New newsletter subscription: ${email}`}
      title="New Newsletter Subscription"
    >
      <EmailField label="Email" value={email} />
    </EmailLayout>
  );
}
