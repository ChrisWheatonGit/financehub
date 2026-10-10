import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "FinanceHub | Dashboard", description: "Open-source self-hosted financial dashboard" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
