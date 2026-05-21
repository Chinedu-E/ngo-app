import { type ReactNode } from "react";

export function Section({
  id,
  children,
  className = "",
  variant = "beige",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  variant?: "beige" | "white" | "forest";
}) {
  const bg =
    variant === "forest"
      ? "bg-forest text-white"
      : variant === "white"
        ? "bg-white"
        : "bg-beige";

  return (
    <section id={id} className={`py-16 md:py-24 ${bg} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  const alignClass = align === "center" ? "text-center mx-auto" : "";
  const titleColor = light ? "text-white" : "text-forest";
  const descColor = light ? "text-white/80" : "text-muted";

  return (
    <div className={`max-w-3xl mb-12 md:mb-16 ${alignClass}`}>
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-widest mb-3 text-sage">{eyebrow}</p>
      )}
      <h2 className={`font-serif text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight ${titleColor}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base md:text-lg leading-relaxed ${descColor}`}>{description}</p>
      )}
    </div>
  );
}

export function PageHero({
  title,
  description,
  image,
}: {
  title: string;
  description?: string;
  image?: string;
}) {
  return (
    <div className="relative bg-forest text-white overflow-hidden">
      {image && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
      <div className="absolute inset-0 bg-forest/80" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight max-w-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-6 text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
}
