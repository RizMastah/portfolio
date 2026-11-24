import type { Metadata, Viewport } from "next";
import { Anton, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ClientEffects } from "@/components/effects/ClientEffects";
import { profile } from "@/content/profile";
import { paletteBootScript } from "@/lib/palette";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const anton = Anton({ variable: "--font-anton", weight: "400", subsets: ["latin"] });
const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});
const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  preload: false,
});

const title = `${profile.name} · Data, AI/ML & Backend`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s · ${profile.name}` },
  description: profile.intro,
  authors: [{ name: profile.name, url: profile.contact.github }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: profile.name,
    title,
    description: profile.intro,
    url: "/",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description: profile.intro },
};

export const viewport: Viewport = {
  themeColor: "#0c0f10",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: siteUrl,
  jobTitle: "Software Engineering student",
  description: profile.intro,
  email: `mailto:${profile.contact.email}`,
  sameAs: [profile.contact.github, profile.contact.linkedin],
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Universitas Islam Indonesia" },
    { "@type": "CollegeOrUniversity", name: "Nanjing Xiaozhuang University" },
  ],
  knowsAbout: ["Data engineering", "Machine learning", "Backend development", "PostgreSQL"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-palette="lab"
      data-theme="dark"
      suppressHydrationWarning
      className={`${anton.variable} ${instrument.variable} ${jetbrains.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: paletteBootScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="min-h-dvh">
        {children}
        <ClientEffects />
        {/* Analytics scripts are served by Vercel only; skip them elsewhere. */}
        {process.env.VERCEL ? (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        ) : null}
      </body>
    </html>
  );
}
