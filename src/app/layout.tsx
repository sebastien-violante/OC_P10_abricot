import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ProfileProvider } from '@/app/context/profileContext'

const inter = Inter({
  variable: "--inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Abricot",
  description: "Abricot.co, une startup qui met à votre disposition un outil SaaS de gestion de projet innovant, utilisant de l’IA pour optimiser les flux de travail des freelances."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

      <html lang="fr" className={`${inter.variable} h-full antialiased`}>
        <body>
          <ProfileProvider>
            {children}
          </ProfileProvider>
        </body>
      </html>
  );
}
