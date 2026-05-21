"use client";

import { useState, type SubmitEvent } from "react";
import { submitForm } from "@/lib/api";
import { Input, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export default function ContactForm() {
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
      subject: form.get("subject"),
      message: form.get("message"),
    };

    try {
      const result = await submitForm("/api/contact", data);
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
      </div>
      <Input id="subject" label="Subject" required />
      <Textarea id="message" label="Message" required />

      {message && (
        <p
          className={`rounded-lg px-4 py-3 text-sm ${
            message.type === "success" ? "bg-sage/15 text-forest" : "bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </p>
      )}

      <Button type="submit" loading={loading} size="lg">
        Send Message
      </Button>
    </form>
  );
}
