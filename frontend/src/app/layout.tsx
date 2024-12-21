import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import AppProviders from "@/context/ctxNA";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { API_URL } from "@/utils/keys";

export const dynamic = "force-dynamic";

const outfit = Outfit({ subsets: ["latin"] });

async function fetchPageTitle(): Promise<string> {
  try {
    const response = await axios.get(`${API_URL}/client`);
    return response.data.name
      ? `${response.data.name} | ProtectData`
      : `ProtectData`;
  } catch (error) {
    return "ProtectData";
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const title = await fetchPageTitle();
  return {
    title,
    description: `ProtectData Dashboard Management`,
    robots: "no-follow"
  };
}

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
