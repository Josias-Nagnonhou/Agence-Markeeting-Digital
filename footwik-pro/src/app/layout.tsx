import type { Metadata } from "next";
import { Manrope, Big_Shoulders_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AgeGateModal } from "@/components/AgeGateModal";
import { ResponsibleGamingBanner } from "@/components/ResponsibleGamingBanner";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const bigShoulders = Big_Shoulders_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Footwik Pro — Comprends chaque match mieux que tout le monde",
  description:
    "Analyses de matchs de football par intelligence artificielle : forme des équipes, statistiques avancées, pronostics avec indice de confiance. Championnats européens et africains, taux de réussite public.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${manrope.variable} ${bigShoulders.variable} antialiased`}>
        <ResponsibleGamingBanner />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <AgeGateModal />
      </body>
    </html>
  );
}
