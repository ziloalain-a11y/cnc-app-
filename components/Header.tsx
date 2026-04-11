"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { WPCategory } from "@/lib/api";

interface HeaderProps {
  categories?: WPCategory[];
}

export default function Header({ categories = [] }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#8B0000] text-white sticky top-0 z-50 shadow-lg">
      {/* Ligne 1 : Ticker FLASH INFO rouge défilant */}
      <div className="bg-red-700 text-white text-xs py-1 overflow-hidden whitespace-nowrap flex items-center">
        <span className="flex-shrink-0 bg-red-900 font-black px-3 py-0.5 mr-0 tracking-widest uppercase text-[10px] h-full flex items-center">
          🔴 FLASH INFO
        </span>
        <div className="overflow-hidden flex-1 ml-2">
          <span className="inline-block animate-ticker">
            CNC — Corbeau News Centrafrique · L&apos;actualité de la République Centrafricaine en temps réel · Politique · Société · Économie · Culture · Sport · Sécurité · Diplomatie · Suivez toute l&apos;actu sur CNC &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            CNC — Corbeau News Centrafrique · L&apos;actualité de la République Centrafricaine en temps réel · Politique · Société · Économie · Culture · Sport · Sécurité · Diplomatie · Suivez toute l&apos;actu sur CNC &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
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
