import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/home/Footer";
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
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <RootProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <Toaster />
        </RootProvider>
      </body>
    </html>
  );
}
