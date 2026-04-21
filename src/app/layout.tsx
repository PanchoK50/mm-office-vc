import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MM Incubator — Brand a Room in Munich's Next Startup Hub",
  description:
    "Manage & More is opening an incubator in Maxvorstadt, Munich, and our best startups are moving in. Brand one of four Incubation Rooms for twelve months — €7,500/year — and join the jury at Demo Day and our Hackathon.",
};

export const viewport: Viewport = {
  themeColor: "#0b0b0f",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-bg text-fg">{children}</body>
    </html>
  );
}
