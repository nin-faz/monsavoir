import type { Metadata, Viewport } from "next";
import { Crimson_Pro } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { TransitionProvider } from "@/context/TransitionContext";
import { ThemeSync } from "@/components/ThemeSync";

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
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MonSavoir",
  },
};

export const viewport: Viewport = {
  themeColor: "#7B1D1D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`h-full ${crimsonPro.variable}`} suppressHydrationWarning>
      <head>
        {/* Blocking script: applies the .dark/.light class before first paint
            so Tailwind's class-scoped `dark:` utilities match the CSS
            variables (which already switch instantly via a
            prefers-color-scheme media query). Without this, the class is
            only added after ThemeSync's effect runs post-hydration, causing
            a visible flash on every element styled with `dark:`. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem("theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d);document.documentElement.classList.toggle("light",!d);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full">
        <MotionConfig reducedMotion="user">
          <ThemeSync />
          <AuthProvider>
            <TransitionProvider>{children}</TransitionProvider>
          </AuthProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
