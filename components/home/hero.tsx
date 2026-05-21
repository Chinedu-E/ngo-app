import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function HomeHero() {
  return (
    <section className="relative min-h-[90vh] flex items-end overflow-hidden bg-forest">
      <Image
        src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1920"
        alt="Diverse community members connecting and supporting one another"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-linear-to-t from-forest via-forest/70 to-forest/30" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24 pt-32">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-widest text-white mb-4">
            Welcome to ThriveParth
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight tracking-tight">
            Helping People Find Community, Opportunity, and Direction.
          </h1>
          <p className="mt-6 text-lg text-white/85 leading-relaxed max-w-2xl">
            ThriveParth is dedicated to supporting newcomers, youth, and individuals through
            mentorship, guidance, community programs, and meaningful opportunities that inspire
            long-term growth and belonging.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-4">
            <Button href="/get-support" size="lg">
              Get Support
            </Button>
            <Button href="/volunteer" variant="secondary" size="lg">
              Volunteer
            </Button>
            <Button
              href="/about"
              variant="outline"
              size="lg"
              className="border-white/30 text-black hover:bg-white/10 hover:text-white bg-transparent"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
