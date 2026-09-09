// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://danieljcoyle.com"),
  title: "Daniel Coyle Portfolio",
  description: "Portfolio — Daniel Coyle (Software Engineer, UCI)",
  openGraph: {
    title: "Daniel Coyle — Software Engineer",
    description: "Portfolio — Daniel Coyle (Software Engineer, UCI)",
    url: "https://danieljcoyle.com",
    siteName: "Daniel Coyle Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daniel Coyle — Software Engineer",
    description: "Portfolio — Daniel Coyle (Software Engineer, UCI)",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ibmPlexSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
