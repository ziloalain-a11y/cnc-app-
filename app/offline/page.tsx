"use client";

export default function OfflinePage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-7xl mb-6">📡</div>
      <h1 className="text-2xl font-black text-gray-900 mb-3">
        Vous êtes hors ligne
      </h1>
      <p className="text-gray-500 max-w-sm mb-8">
        Impossible de charger les actualités. Vérifiez votre connexion
        internet et réessayez.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-[#8B0000] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#6B0000] transition-colors"
      >
        Réessayer
      </button>
    </div>
  );
}
