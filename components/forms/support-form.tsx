"use client";

import { useState, type SubmitEvent } from "react";
import { submitForm } from "@/lib/api";
import {
  AUDIENCE_OPTIONS,
  CONTACT_METHODS,
  SUPPORT_CATEGORIES,
} from "@/lib/site";
import { Input, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export default function SupportForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setLoading(true);
    setMessage(null);

    const form = new FormData(formEl);
    const data = {
      fullName: form.get("fullName"),
      email: form.get("email"),
      phone: form.get("phone") || undefined,
      ageRange: form.get("ageRange") || undefined,
      audience: form.get("audience") || undefined,
      supportType: form.get("supportType"),
      contactMethod: form.get("contactMethod"),
      message: form.get("message"),
      consent: form.get("consent") === "on",
    };

    try {
      const result = await submitForm("/api/support", data);
      setMessage({ type: "success", text: result.message });
      formEl.reset();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl border border-forest/10 p-6 md:p-8 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input id="fullName" label="Full Name" required />
        <Input id="email" label="Email Address" type="email" required />
        <Input id="phone" label="Phone Number (optional)" type="tel" />
        <Input id="ageRange" label="Age Range (optional)" placeholder="e.g. 18–24" />
        <Select id="audience" label="Are you a newcomer, student, youth, etc.?">
          <option value="">Select an option</option>
          {AUDIENCE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </Select>
        <Select id="supportType" label="What type of support are you looking for?" required>
          <option value="">Select support type</option>
          {SUPPORT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>
        <Select id="contactMethod" label="Preferred Contact Method" required>
          {CONTACT_METHODS.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </Select>
      </div>

      <Textarea id="message" label="Short Description / Message" required rows={5} />

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-1 h-4 w-4 rounded border-forest/20 text-forest focus:ring-sage"
        />
        <span className="text-sm text-muted leading-relaxed">
          I consent to ThriveParth contacting me regarding my support request and storing this
          information for follow-up purposes.
        </span>
      </label>

      {message && (
        <p
          className={`rounded-lg px-4 py-3 text-sm ${
            message.type === "success"
              ? "bg-sage/15 text-forest"
              : "bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </p>
      )}

      <Button type="submit" loading={loading} size="lg">
        Submit Request
      </Button>
    </form>
  );
}
