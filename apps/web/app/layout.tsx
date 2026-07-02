import type { Metadata, Viewport } from "next";
import { CartMount } from "../components/cart/CartMount";
import { Header } from "../components/layout/Header";
import { AppProviders } from "../components/providers/AppProviders";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const title = "HeliPhone Aurora | HeliCorp";
const description = "HeliPhone Aurora la dong smartphone flagship voi man hinh OLED, camera AI, thiet ke cao cap va hieu nang manh me.";
const ogImage = "https://placehold.co/1200x630/111827/ffffff.png?text=HeliPhone+Aurora";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | HeliCorp"
  },
  description,
  alternates: {
    canonical: siteUrl
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg"
  },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "HeliCorp",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "HeliPhone Aurora"
      }
    ],
    locale: "vi_VN",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage]
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8fb" },
    { media: "(prefers-color-scheme: dark)", color: "#070b16" }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://placehold.co" />
        <link rel="dns-prefetch" href="https://placehold.co" />
      </head>
      <body className="font-sans antialiased">
        <AppProviders>
          <Header />
          {children}
          <CartMount />
        </AppProviders>
      </body>
    </html>
  );
}
