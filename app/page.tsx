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
import GallerySection from "@/components/home/gallery-section";
import { getPublicFolders } from "@/lib/gallery/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const galleryFolders = await getPublicFolders();

  return (
    <>
      <HomeHero />
      <WhoWeAre />
      <MissionVision />
      <WhatWeDo />
      <CommunityImpact />
      {galleryFolders.length > 0 && <GallerySection folders={galleryFolders} />}
      <HowItWorks />
      <Testimonials />
      <NewsletterSection />
    </>
  );
}
