import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "CommonSense | Your financial home", description: "Make cents of your money. A calmer home for personal and household finances.", icons: { icon: "/commonsense-mark.svg" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
