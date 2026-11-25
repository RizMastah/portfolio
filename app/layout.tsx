import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Doto, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ClientEffects } from "@/components/effects/ClientEffects";
import { profile } from "@/content/profile";
import { fxBootScript } from "@/lib/fx-boot";
import { themeBootScript, themeColors } from "@/lib/theme";
import { siteUrl } from "@/lib/site";
import "./globals.css";

// Variable font (wght 100–900): the hero name eases its weight toward the cursor.
const bigShoulders = Big_Shoulders({
  variable: "--font-big-shoulders",
  subsets: ["latin"],
});
const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});
// Dot-matrix face, used only for the small "scan" caption under the portrait.
const doto = Doto({
  variable: "--font-doto",
  weight: "700",
  subsets: ["latin"],
  preload: false,
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

// Updated at runtime to the visitor's mode (see themeBootScript).
export const viewport: Viewport = {
  themeColor: themeColors.dark,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: siteUrl,
  jobTitle: "Software Engineering student",
  description: profile.intro,
  email: `mailto:${profile.contact.email}`,
  sameAs: [profile.contact.github, profile.contact.linkedin, profile.contact.instagram],
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
      data-theme="dark"
      suppressHydrationWarning
      className={`${bigShoulders.variable} ${instrument.variable} ${jetbrains.variable} ${doto.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript + fxBootScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="label bg-accent text-accent-fg sr-only z-[60] rounded px-3 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
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
