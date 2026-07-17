import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const isGitHubPages = process.env.GITHUB_PAGES === "true";
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3001";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const baseUrl = `${protocol}://${host}`;
  const canonicalUrl = isGitHubPages
    ? "https://ahmedbahathiq.com"
    : baseUrl;
  const assetBaseUrl = isGitHubPages
    ? "https://ahmedbahathiq.com"
    : baseUrl;

  return {
    title: "أحمد باحاذق | مهندس ذكاء اصطناعي ومطور",
    description:
      "الموقع الشخصي لأحمد يوسف عمر باحاذق - طالب ذكاء اصطناعي ومطور تجارب ويب مدعومة بالذكاء الاصطناعي في جدة.",
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: "Ahmed Bahathiq | AI Engineer",
      description: "AI student and AI-assisted developer building smart digital experiences.",
      type: "website",
      url: canonicalUrl,
      locale: "ar_SA",
      alternateLocale: "en_US",
      images: [{ url: `${assetBaseUrl}/og.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Ahmed Bahathiq | AI Engineer",
      description: "AI student and AI-assisted developer building smart digital experiences.",
      images: [`${assetBaseUrl}/og.png`],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
