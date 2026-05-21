import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { siteMetadata, siteViewport } from "@/lib/metadata";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const bodyFont = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
});

const headingFont = Source_Serif_4({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata = siteMetadata;
export const viewport = siteViewport;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${headingFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
