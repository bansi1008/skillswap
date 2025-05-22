import { Inter } from "next/font/google";
import "./globals.css";

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
  authors: [{ name: "SkillSwap Team" }],
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
