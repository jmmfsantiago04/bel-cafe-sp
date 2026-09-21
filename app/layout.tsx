import type { Metadata } from "next";
import { Inter, Gloria_Hallelujah } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/site-chrome";
import { Toaster } from "@/components/ui/sonner";
import { RootProvider } from "./providers/root-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans-body",
});

const gloria = Gloria_Hallelujah({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "É de Chão - Comida de Afeto",
  description: "Sabores autênticos do Nordeste brasileiro em cada prato",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.className} ${inter.variable} ${gloria.variable} flex min-h-dvh flex-col`}
      >
        <RootProvider>
          <SiteChrome>{children}</SiteChrome>
          <Toaster />
        </RootProvider>
      </body>
    </html>
  );
}
