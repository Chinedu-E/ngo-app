export const emailColors = {
  forest: "#1F4D3A",
  sage: "#6F9B7A",
  beige: "#F4EBDD",
  foreground: "#1A2E26",
  muted: "#4A6358",
  white: "#FFFFFF",
  border: "rgba(31, 77, 58, 0.1)",
} as const;

export const emailFonts = {
  sans: 'Georgia, "Times New Roman", serif',
  body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
} as const;

export { getSiteUrl } from "@/lib/site";
