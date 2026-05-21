import HomeHero from "@/components/home/hero";
import {
  WhoWeAre,
  MissionVision,
  WhatWeDo,
  CommunityImpact,
  HowItWorks,
  Testimonials,
  NewsletterSection,
} from "@/components/home/content-sections";

export default function Home() {
  return (
    <>
      <HomeHero />
      <WhoWeAre />
      <MissionVision />
      <WhatWeDo />
      <CommunityImpact />
      <HowItWorks />
      <Testimonials />
      <NewsletterSection />
    </>
  );
}
