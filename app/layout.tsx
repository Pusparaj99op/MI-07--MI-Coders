import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TalentIntel - AI Recruitment Engine",
  description: "AI-powered recruitment platform for intelligent talent acquisition",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
