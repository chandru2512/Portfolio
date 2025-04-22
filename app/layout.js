

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StarsCanvas } from "@/components/main/star-background";
import { Navbar } from "@/components/main/navbar";

import { LoadingProvider } from "@/components/ui/loadingprovider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SURF - Solutions of Creative Responsive Frontends",
  description: "Innovative digital solutions for modern businesses",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LoadingProvider>
          <StarsCanvas />
          <Navbar />
          {children}
        </LoadingProvider>
      </body>
    </html>
  );
}
