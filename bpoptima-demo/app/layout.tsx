import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// bpoptima.com's real stack is Satoshi (body) / General Sans (display) /
// JetBrains Mono (data) — neither Satoshi nor General Sans ship on Google
// Fonts, and pulling them from a third-party CDN at runtime would trade away
// the zero-external-dependency self-hosting next/font/google already gives
// us. Inter and Plus Jakarta Sans are the closest self-hosted equivalents;
// JetBrains Mono is an exact match.
const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const displayFont = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono-brand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GroundSet Decision Pipeline — Live Demo",
  description:
    "A sandboxed, in-browser walkthrough of evidence to structured data to deterministic policy decision to audit trail.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
