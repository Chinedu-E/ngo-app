import Image from "next/image";
import { ArrowRight, Users, Heart, Target, Compass } from "lucide-react";
import NewsletterForm from "@/components/forms/newsletter-form";
import { Section, SectionHeader } from "@/components/ui/section";
import { WHAT_WE_DO } from "@/lib/site";
import { Button } from "@/components/ui/button";

export function WhoWeAre() {
  return (
    <Section variant="white" id="who-we-are">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <SectionHeader
          eyebrow="Who We Are"
          title="A community-driven organization built on belonging"
          description="ThriveParth is a community-driven organization focused on creating opportunities, support systems, and meaningful connections for individuals navigating new environments, life transitions, and personal growth journeys."
        />
        <p className="text-muted text-base md:text-lg leading-relaxed">
          We believe every individual deserves access to guidance, encouragement, resources, and a
          supportive community regardless of their background or circumstances.
        </p>
      </div>
    </Section>
  );
}

export function MissionVision() {
  const items = [
    {
      icon: Target,
      title: "Our Mission",
      text: "Our mission is to empower individuals through mentorship, education, support services, community initiatives, and meaningful human connection. We aim to build environments where people feel seen, supported, and equipped to thrive.",
    },
    {
      icon: Compass,
      title: "Our Vision",
      text: "To create inclusive communities where every individual has access to opportunities, support networks, and the confidence needed to build a brighter future.",
    },
  ];

  return (
    <Section>
      <div className="grid md:grid-cols-2 gap-8">
        {items.map((item) => (
          <article
            key={item.title}
            className="bg-white rounded-xl border border-forest/10 p-8 shadow-sm"
          >
            <item.icon className="h-8 w-8 text-sage mb-4" />
            <h3 className="font-serif text-2xl text-forest font-semibold mb-3">{item.title}</h3>
            <p className="text-muted leading-relaxed">{item.text}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function WhatWeDo() {
  return (
    <Section variant="white" id="what-we-do">
      <SectionHeader
        eyebrow="What We Do"
        title="Programs and support that meet people where they are"
        align="center"
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {WHAT_WE_DO.map((item) => (
          <article
            key={item.title}
            className="group bg-beige rounded-xl overflow-hidden border border-forest/10 hover:border-sage/40 transition-colors"
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="p-6">
              <h3 className="font-serif text-xl text-forest font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Button href="/programs" variant="outline">
          Explore All Programs
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </Section>
  );
}

export function CommunityImpact() {
  const stats = [
    { value: "100+", label: "Community Members Supported", icon: Users },
    { value: "20+", label: "Volunteer Contributors", icon: Heart },
    { value: "Multiple", label: "Community Programs", icon: Target },
    { value: "Growing", label: "Support Network", icon: Compass },
  ];

  return (
    <Section variant="forest">
      <SectionHeader
        eyebrow="Community Impact"
        title="Building momentum together"
        light
        align="center"
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="text-center bg-white/10 rounded-xl border border-white/10 p-6 md:p-8"
          >
            <stat.icon className="h-6 w-6 text-sage mx-auto mb-4" />
            <p className="font-serif text-3xl md:text-4xl font-semibold text-white">{stat.value}</p>
            <p className="mt-2 text-sm text-white/75">{stat.label}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function HowItWorks() {
  const steps = [
    { step: "01", title: "Reach Out Through ThriveParth", text: "Share your needs through our support form or contact channels." },
    { step: "02", title: "Connect With Our Team", text: "A team member will reach out to understand your goals and context." },
    { step: "03", title: "Receive Guidance, Resources, or Community Support", text: "Access mentorship, programs, and connections tailored to you." },
    { step: "04", title: "Continue Growing Through Programs & Opportunities", text: "Stay engaged through workshops, events, and ongoing community care." },
  ];

  return (
    <Section>
      <SectionHeader
        eyebrow="How It Works"
        title="A simple path from outreach to growth"
        align="center"
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((item) => (
          <article key={item.step} className="relative bg-white rounded-xl border border-forest/10 p-6">
            <span className="text-xs font-bold text-sage uppercase tracking-widest">Step {item.step}</span>
            <h3 className="font-serif text-lg text-forest font-semibold mt-2 mb-3">{item.title}</h3>
            <p className="text-sm text-muted leading-relaxed">{item.text}</p>
          </article>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Button href="/get-support" size="lg">
          Start Your Journey
        </Button>
      </div>
    </Section>
  );
}

export function Testimonials() {
  const quotes = [
    {
      text: "ThriveParth helped me feel more connected and confident navigating opportunities in a new environment.",
      author: "Community Member",
    },
    {
      text: "The mentorship and support I received genuinely made a difference for me.",
      author: "Program Participant",
    },
  ];

  return (
    <Section variant="white" id="testimonials">
      <SectionHeader eyebrow="Testimonials" title="Stories from our community" align="center" />
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {quotes.map((q) => (
          <blockquote
            key={q.text}
            className="bg-beige rounded-xl border border-forest/10 p-8 relative"
          >
            <p className="font-serif text-xl text-forest leading-relaxed">&ldquo;{q.text}&rdquo;</p>
            <footer className="mt-6 text-sm font-semibold text-sage">— {q.author}</footer>
          </blockquote>
        ))}
      </div>
    </Section>
  );
}

export function NewsletterSection() {
  return (
    <Section id="newsletter">
      <div className="bg-forest rounded-xl p-8 md:p-12 text-center text-white">
        <h2 className="font-serif text-3xl md:text-4xl font-semibold">Stay Connected With ThriveParth</h2>
        <p className="mt-4 text-white/80 max-w-xl mx-auto">
          Receive updates about programs, workshops, events, and community opportunities.
        </p>
        <div className="mt-8 max-w-md mx-auto">
          <NewsletterForm variant="section" />
        </div>
      </div>
    </Section>
  );
}
