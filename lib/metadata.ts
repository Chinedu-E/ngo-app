import type { Metadata, Viewport } from "next";
import { getSiteUrl, SITE } from "@/lib/site";

const defaultTitle = `${SITE.name} — ${SITE.tagline}`;

export const siteMetadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: defaultTitle,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: getSiteUrl() }],
  creator: SITE.name,
  publisher: SITE.name,
  keywords: [
    "ThriveParth",
    "community organization",
    "newcomer support",
    "youth mentorship",
    "career guidance",
    "community programs",
    "volunteer",
    "nonprofit",
  ],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: getSiteUrl(),
    siteName: SITE.name,
    title: defaultTitle,
    description: SITE.description,
    images: [
      {
        url: SITE.ogImage,
        width: SITE.ogImageWidth,
        height: SITE.ogImageHeight,
        alt: `${SITE.name} — community programs and mentorship`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  category: "nonprofit",
};

export const siteViewport: Viewport = {
  themeColor: SITE.themeColor,
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};
