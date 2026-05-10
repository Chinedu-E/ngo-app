import Hero from "@/components/landing/hero";
import Services from "@/components/landing/services";
import Testimonials from "@/components/landing/testimonials";
import Contact from "@/components/landing/contact";

export default function Home() {
  return (
    <div className="">
      <Hero />
      <Services />
      <Testimonials />
      <Contact />
    </div>
  );
}
