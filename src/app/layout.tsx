import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { websiteJsonLd } from "@/lib/jsonld";
import { DEFAULT_SOCIAL_IMAGE, SITE_ORIGIN, absoluteAssetUrl } from "@/lib/site";
import "./globals.css";

const defaultSocialImage = absoluteAssetUrl(DEFAULT_SOCIAL_IMAGE);

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "Weekend Experiments — Kids experiments for ages 1–5",
    template: "%s · Weekend Experiments",
  },
  description:
    "Parent-tested experiment ideas for toddlers and preschoolers. Real home runs that kids enjoyed and that show a physical phenomenon.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Weekend Experiments",
    title: "Weekend Experiments — Kids experiments for ages 1–5",
    description:
      "Parent-tested experiment ideas for toddlers and preschoolers. Real home runs that kids enjoyed and that show a physical phenomenon.",
    images: [{ url: defaultSocialImage }],
  },
  twitter: {
    card: "summary_large_image",
    images: [defaultSocialImage],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <head>
        <link rel="describedby" href="/llms.txt" />
        <JsonLd data={websiteJsonLd} />
      </head>
      <body className="flex min-h-full flex-col bg-cream text-ink">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
