import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/effects.css"; // Import our custom effects CSS
import { ThemeProvider } from "../hooks/useTheme";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "~ echotext ~",
  description: "Create beautiful text with visual effects like shake, ripple, and jitter. Customize colors and formatting, then share with a unique link.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Ensure minimum height */}
      <body className={`${inter.className} min-h-screen`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
