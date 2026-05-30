export const SITE = {
  name: "ThriveParth",
  tagline: "Community, opportunity, and direction.",
  supportEmail: "support@thriveparth.org",
  companyNumber: "+1 (647) 228-9454",
  missionStatementPath: "/Thriveparth Foundational Overview 2.pdf",
  description:
    "ThriveParth supports newcomers, youth, and individuals through mentorship, guidance, community programs, and meaningful opportunities.",
  ogImage: "/thriveparth.jpg",
  ogImageWidth: 1254,
  ogImageHeight: 1254,
  locale: "en_CA",
  themeColor: "#1f4d3a",
} as const;

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Programs", href: "/programs" },
  { name: "Get Support", href: "/get-support" },
  { name: "Volunteer", href: "/volunteer" },
  { name: "Events", href: "/events" },
  { name: "Contact", href: "/contact" },
] as const;

export const SOCIAL_LINKS = [
  { name: "Instagram", href: "https://instagram.com" },
  { name: "LinkedIn", href: "https://linkedin.com" },
  { name: "Facebook", href: "https://facebook.com" },
] as const;

export const SUPPORT_CATEGORIES = [
  "Career Guidance",
  "Mentorship",
  "Community Resources",
  "Workshops & Programs",
  "General Support",
] as const;

export const AUDIENCE_OPTIONS = [
  "Newcomer",
  "Student",
  "Youth",
  "Young Adult",
  "Other",
] as const;

export const CONTACT_METHODS = ["Email", "Phone", "Either"] as const;

export const VOLUNTEER_AREAS = [
  "Event Support",
  "Mentorship",
  "Community Outreach",
  "Administrative Assistance",
  "Social Media & Content",
  "Photography/Videography",
] as const;

export const PROGRAMS = [
  {
    slug: "newcomer-support",
    title: "Newcomer Support",
    short:
      "Navigate opportunities, resources, and life transitions with confidence and community support.",
    details: [
      "Resource guidance",
      "Community connections",
      "Peer support",
      "Information sharing",
    ],
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1200",
  },
  {
    slug: "career-guidance",
    title: "Career & Resume Guidance",
    short:
      "Resume reviews, interview preparation, professional mentorship, and career development support.",
    details: [
      "Resume assistance",
      "LinkedIn guidance",
      "Interview preparation",
      "Career conversations",
    ],
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1200",
  },
  {
    slug: "youth-mentorship",
    title: "Youth Mentorship",
    short:
      "Growth, leadership, confidence, and personal development through mentorship and supportive guidance.",
    details: [
      "Goal setting",
      "Leadership conversations",
      "Mentorship sessions",
      "Personal development",
    ],
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200",
  },
  {
    slug: "community-wellness",
    title: "Community Wellness",
    short:
      "Safe, supportive environments that encourage emotional wellness, connection, and community care.",
    details: [
      "Wellness conversations",
      "Community gatherings",
      "Support spaces",
      "Social connection",
    ],
    image:
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1200",
  },
  {
    slug: "workshops-events",
    title: "Workshops & Networking",
    short:
      "Educational workshops, networking opportunities, and growth-focused community events.",
    details: [
      "Networking sessions",
      "Educational workshops",
      "Community events",
      "Growth opportunities",
    ],
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200",
  },
] as const;

export const WHAT_WE_DO = [
  {
    title: "Newcomer Support",
    description:
      "Guidance and community connections for individuals navigating new environments and transitions.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Career Guidance",
    description:
      "Resume support, interview preparation, and mentorship to build professional confidence.",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Youth Mentorship",
    description:
      "Supportive mentorship that encourages leadership, growth, and personal development.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Community Wellness",
    description:
      "Spaces for connection, emotional wellness, and meaningful community care.",
    image:
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Workshops & Events",
    description:
      "Educational workshops and networking events designed to inspire growth and belonging.",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
  },
] as const;

export const EVENTS = [
  {
    id: "resume-workshop",
    title: "Resume & Interview Workshop",
    description:
      "Join ThriveParth for a free interactive workshop focused on resume improvement, interview preparation, and career confidence building.",
    date: "Saturday, June 14, 2026",
    time: "10:00 AM – 1:00 PM",
    location: "Community Hub — Downtown",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1200",
    upcoming: true,
  },
  {
    id: "networking-circle",
    title: "Community Networking Circle",
    description:
      "An open gathering for newcomers and young professionals to connect, share experiences, and build supportive relationships.",
    date: "Thursday, July 10, 2026",
    time: "6:00 PM – 8:00 PM",
    location: "ThriveParth Community Space",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200",
    upcoming: true,
  },
  {
    id: "wellness-gathering",
    title: "Wellness & Connection Gathering",
    description:
      "A supportive group conversation focused on emotional wellness, belonging, and community care.",
    date: "March 22, 2026",
    time: "2:00 PM – 4:00 PM",
    location: "Community Hub — Downtown",
    image:
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1200",
    upcoming: false,
  },
] as const;
