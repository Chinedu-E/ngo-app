"use client";

import { useState, type SubmitEvent } from "react";
import { submitForm } from "@/lib/api";
import { VOLUNTEER_AREAS } from "@/lib/site";
import { Input, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export default function VolunteerForm() {
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
      phone: form.get("phone"),
      areasOfInterest: form.get("areasOfInterest"),
      skills: form.get("skills"),
      availability: form.get("availability"),
      whyVolunteer: form.get("whyVolunteer"),
    };

    try {
      const result = await submitForm("/api/volunteer", data);
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
        <Input id="phone" label="Phone Number" type="tel" required />
        <Select id="areasOfInterest" label="Areas of Interest" required>
          <option value="">Select an area</option>
          {VOLUNTEER_AREAS.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </Select>
      </div>
      <Input id="skills" label="Skills / Experience" required />
      <Input id="availability" label="Availability" required placeholder="e.g. Weekends, evenings" />
      <Textarea
        id="whyVolunteer"
        label="Why would you like to volunteer with ThriveParth?"
        required
      />

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
        Submit Application
      </Button>
    </form>
  );
}
