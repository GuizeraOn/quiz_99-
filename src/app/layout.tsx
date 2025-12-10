import type { Metadata } from "next";
import { Merriweather, Open_Sans } from "next/font/google";
import "./globals.css";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnalyticsScripts from "@/components/AnalyticsScripts";
import { Suspense } from "react";

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  display: 'swap',
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Instituto de Vitalidade Avançada",
  description: "Análisis de perfil metabólico y longevidad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        suppressHydrationWarning={true}
        className={`${merriweather.variable} ${openSans.variable} antialiased min-h-[100dvh] flex flex-col bg-background text-text-main font-sans overflow-x-hidden pb-[env(safe-area-inset-bottom)]`}
      >
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <Suspense fallback={null}>
          <AnalyticsScripts />
        </Suspense>
      </body>
    </html>
  );
}
