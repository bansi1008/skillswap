// layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

import { Analytics } from "@vercel/analytics/next";
const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "SkillSwap - Connect, Learn & Share Skills",
  description:
    "SkillSwap is a skill-based networking platform where users can connect with others by specifying the skills they offer and the skills they want to learn. Join our community today!",
  keywords: [
    "skill sharing",
    "networking",
    "learning",
    "teaching",
    "community",
    "skill exchange",
  ],
  authors: [{ name: "Bansi Dobariya" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "SkillSwap - Connect, Learn & Share Skills",
    description: "Join our skill-sharing community to connect, learn and teach",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: "no",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
