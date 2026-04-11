import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import InstallButton from "@/components/InstallButton";
import NotificationButton from "@/components/NotificationButton";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { getCategories } from "@/lib/api";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "CNC - Corbeau News Centrafrique",
    template: "%s | CNC",
  },
  description:
    "L'actualité de la République Centrafricaine en temps réel. Politique, société, économie, culture et sport.",
  manifest: "/manifest.json",
  keywords: [
    "centrafrique",
    "RCA",
    "Bangui",
    "actualité",
    "news",
    "corbeau news",
    "CNC",
  ],
  authors: [{ name: "CNC - Corbeau News Centrafrique" }],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CNC",
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "CNC - Corbeau News Centrafrique",
    title: "CNC - Corbeau News Centrafrique",
    description:
      "L'actualité de la République Centrafricaine en temps réel.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CNC - Corbeau News Centrafrique",
    description: "L'actualité de la République Centrafricaine en temps réel.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#8B0000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  try {
    categories = await getCategories();
  } catch {
    // Header works without categories
  }

  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-sans bg-gray-50 min-h-screen flex flex-col">
        <Header categories={categories} />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-4">
          {children}
        </main>

        <footer className="bg-[#1a1a1a] text-white mt-12">
          <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
              {/* Brand */}
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#8B0000] rounded-full flex items-center justify-center">
                    <span className="text-white font-black text-sm">CNC</span>
                  </div>
                  <div>
                    <div className="font-black text-lg leading-tight">CNC</div>
                    <div className="text-gray-400 text-xs">
                      Corbeau News Centrafrique
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm max-w-xs">
                  L'actualité de la République Centrafricaine en temps réel.
                </p>
              </div>

              {/* Links */}
              <div className="flex flex-col items-center md:items-end gap-2 text-sm text-gray-400">
                <a
                  href="https://corbeaunews-centrafrique.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Site principal →
                </a>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-500">
              © {new Date().getFullYear()} Corbeau News Centrafrique. Tous
              droits réservés.
            </div>
          </div>
        </footer>

        {/* PWA components */}
        <InstallButton />
        <NotificationButton />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
