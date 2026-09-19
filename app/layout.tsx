import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/site-chrome";
import { Toaster } from "@/components/ui/sonner";
import { RootProvider } from "./providers/root-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "É de Chão - Comida de Afeto",
  description: "Sabores autênticos do Nordeste brasileiro em cada prato",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} flex min-h-dvh flex-col`}>
        <RootProvider>
          <SiteChrome>{children}</SiteChrome>
          <Toaster />
        </RootProvider>
      </body>
    </html>
  );
}