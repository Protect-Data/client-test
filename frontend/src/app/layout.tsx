import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import AppProviders from "@/context/ctxNA";
import { Toaster } from "react-hot-toast";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProtectData",
  description: "Dashboard management"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className="h-full">
      <body className={`h-full ${outfit.className}`}>
        <AppProviders>{children}</AppProviders>
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
