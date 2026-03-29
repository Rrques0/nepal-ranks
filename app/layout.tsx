import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — Nepal Ko Leaderboard`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://nepalranks.com"),
  openGraph: {
    title: `${APP_NAME} — Nepal Ko Leaderboard`,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — Nepal Ko Leaderboard`,
    description: APP_DESCRIPTION,
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#DC143C",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans bg-[#0A0A0A] text-white antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#141414",
              border: "1px solid #2A2A2A",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}
