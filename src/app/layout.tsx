import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from '@vercel/analytics/react';
import "./globals.css";
import "../styles/effects.css"; // Import our custom effects CSS
import { ThemeProvider } from "../hooks/useTheme";

// Define the custom font
const customFont = localFont({
  src: [
    {
      path: '../../public/fonts/StyreneB-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/StyreneB-Bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-custom',
});

export const metadata: Metadata = {
  title: "~ echotext ~",
  description: "Share beautiful text with visual effects like shake, ripple, and jitter. Customize colors and formatting, then share with a unique link.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Ensure minimum height */}
      <body className={`${customFont.className} min-h-screen`}>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
