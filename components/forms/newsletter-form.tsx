"use client";

import { useState, type SubmitEvent } from "react";
import { submitForm } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function NewsletterForm({ variant = "section" }: { variant?: "section" | "footer" }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const result = await submitForm("/api/newsletter", { email });
      setMessage({ type: "success", text: result.message });
      setEmail("");
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  }

  const isFooter = variant === "footer";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className={`flex-1 rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sage/40 ${
            isFooter
              ? "bg-white/10 border-white/20 text-white placeholder:text-white/50"
              : "bg-white border-forest/15 text-foreground"
          }`}
        />
        <Button type="submit" loading={loading} variant={"secondary" } size="md">
          Subscribe
        </Button>
      </div>
      {message && (
        <p className={`text-sm ${message.type === "success" ? "text-sage" : "text-red-300"}`}>
          {message.text}
        </p>
      )}
    </form>
  );
}
