import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/effects.css"; // Import our custom effects CSS

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EchoText - Create and Share Text with Effects",
  description: "Create beautiful text with visual effects like shake, ripple, and jitter. Customize colors and formatting, then share with a unique link.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
