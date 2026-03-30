import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Echora — Learn Loud. Post Smart.",
  description:
    "Transform your scattered research into a living knowledge graph, then let AI agents craft authentic posts that cite your real sources.",
  keywords: [
    "knowledge graph",
    "AI content",
    "LinkedIn automation",
    "thought leadership",
    "personal branding",
  ],
  openGraph: {
    title: "Echora — Learn Loud. Post Smart.",
    description:
      "Transform your scattered research into a living knowledge graph, then let AI agents craft authentic posts that cite your real sources.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("dark", "font-sans", geist.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700&family=Inter+Tight:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-surface-900 text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
