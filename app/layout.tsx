import { UIStoreProvider } from "@/stores/ui/provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "./components/footer";
import GlobalLoading from "./components/globalLoading";
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
      <UIStoreProvider>
        <GlobalLoading />
        <body className="h-dvh flex flex-col items-center">
          <main className="h-[calc(100%-4rem)] w-full sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-4/12">
            {children}
          </main>
          <Footer />
        </body>
      </UIStoreProvider>
    </html>
  );
}
