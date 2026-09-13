"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { WPCategory } from "@/lib/api";

interface HeaderProps {
  categories?: WPCategory[];
}

const ALERTE_URL = "https://corbeaunews-centrafrique.org/wp-json/cnc/v1/alerte";
const DEFAULT_TICKER_TEXT =
  "CNC — Corbeau News Centrafrique · L'actualité de la République Centrafricaine en temps réel · Politique · Société · Économie · Culture · Sport · Sécurité · Diplomatie · Suivez toute l'actu sur CNC";

export default function Header({ categories = [] }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tickerText, setTickerText] = useState(DEFAULT_TICKER_TEXT);
  const [tickerLink, setTickerLink] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchAlerte() {
      try {
        const res = await fetch(ALERTE_URL);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        if (data?.texte) {
          setTickerText(String(data.texte).replace(/\n/g, " "));
        }
        setTickerLink(data?.lien ? String(data.lien) : null);
      } catch {
        // Fetch failed: keep the current/default ticker text
      }
    }

    fetchAlerte();
    const interval = setInterval(fetchAlerte, 60000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="bg-[#8B0000] text-white sticky top-0 z-50 shadow-lg">
      {/* Ligne 1 : Ticker FLASH INFO rouge défilant */}
      <div className="bg-red-700 text-white text-xs py-1 overflow-hidden whitespace-nowrap flex items-center">
        <span className="flex-shrink-0 bg-red-900 font-black px-3 py-0.5 mr-0 tracking-widest uppercase text-[10px] h-full flex items-center">
          🔴 FLASH INFO
        </span>
        <div className="overflow-hidden flex-1 ml-2">
          {tickerLink ? (
            <a
              href={tickerLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block animate-ticker hover:underline"
            >
              {tickerText} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {tickerText} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </a>
          ) : (
            <span className="inline-block animate-ticker">
              {tickerText} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {tickerText} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          )}
        </div>
      </div>

      {/* Ligne 2 : Logo à gauche + Bannière à droite */}
      <div className="flex items-stretch" style={{ height: "55px" }}>
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center bg-white px-2">
          <Image
            src="/logo-cnc.png"
            alt="Logo CNC"
            width={160}
            height={55}
            className="h-[55px] w-auto object-contain"
            priority
          />
        </Link>

        {/* Bannière - occupe tout l'espace restant */}
        <div className="flex-1 relative overflow-hidden">
          <Image
            src="/banniere-cnc.jpg"
            alt="Bannière CNC - Corbeau News Centrafrique"
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 768px) 80vw, 90vw"
          />
        </div>

        {/* Bouton recherche */}
        <Link
          href="/recherche"
          className="flex-shrink-0 flex items-center px-4 bg-[#8B0000] hover:bg-[#6B0000] transition-colors"
          aria-label="Ouvrir la recherche"
        >
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </Link>

        {/* Burger mobile */}
        <button
          className="md:hidden flex-shrink-0 px-4 bg-[#8B0000] hover:bg-[#6B0000] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
        >
          <svg
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Ligne 3 : Menu horizontal des catégories scrollable (desktop) */}
      <div className="hidden md:block bg-[#6B0000] overflow-x-auto scrollbar-hide border-t border-red-900">
        <nav className="flex items-center min-w-max px-2 py-1">
          <Link
            href="/"
            className="px-3 py-1.5 text-sm font-bold text-white hover:bg-white/20 rounded transition-colors whitespace-nowrap"
          >
            Accueil
          </Link>
          <span className="text-red-400 mx-1">|</span>
          {categories.map((cat, i) => (
            <span key={cat.id} className="flex items-center">
              <Link
                href={`/?category=${cat.id}`}
                className="px-3 py-1.5 text-sm font-medium text-red-100 hover:bg-white/20 hover:text-white rounded transition-colors whitespace-nowrap"
              >
                {cat.name}
              </Link>
              {i < categories.length - 1 && (
                <span className="text-red-500 text-xs">·</span>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#6B0000] border-t border-red-800 max-h-64 overflow-y-auto">
          <nav className="flex flex-col">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="py-3 px-4 border-b border-red-800 font-semibold hover:bg-white/10 transition-colors text-sm"
            >
              🏠 Accueil
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/?category=${cat.id}`}
                onClick={() => setMenuOpen(false)}
                className="py-3 px-4 border-b border-red-800 hover:bg-white/10 transition-colors text-sm"
              >
                {cat.name}
                <span className="ml-2 text-xs text-red-300">({cat.count})</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
