import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "./components/footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rankify",
  description: "Ranking service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="h-dvh flex flex-col">
        <main className="h-[calc(100%-4rem)] ">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
