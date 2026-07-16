import type { Metadata, Viewport } from "next";
import { Crimson_Pro } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-crimson",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MonSavoir",
  description: "Ton cabinet de curiosités intellectuelles",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#7B1D1D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`h-full ${crimsonPro.variable}`}>
      <body className="min-h-full">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
