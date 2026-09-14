import Link from "next/link";
import type { Metadata } from "next";
import ArticleInfiniteScroll from "@/components/ArticleInfiniteScroll";
import { getPosts } from "@/lib/api";

export const revalidate = 0;

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Résultats pour "${q}" | CNC` : "Recherche | CNC",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = (q || "").trim();

  let posts: Awaited<ReturnType<typeof getPosts>>["posts"] = [];
  let totalPages = 1;
  let error = false;

  if (query) {
    try {
      const result = await getPosts({ search: query, page: 1, perPage: 22 });
      posts = result.posts;
      totalPages = result.totalPages;
    } catch {
      error = true;
    }
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[#8B0000] font-semibold text-sm mb-6 hover:underline"
      >
        <svg
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Retour aux actualités
      </Link>

      <h1 className="text-2xl font-black text-gray-900 mb-5">Rechercher un article</h1>

      <form action="/recherche" method="GET" className="mb-8 flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label
            htmlFor="search-input"
            className="block text-sm font-semibold text-gray-700 mb-1.5"
          >
            Rechercher un article
          </label>
          <input
            id="search-input"
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Ex : élections, sécurité, Bangui…"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          className="sm:self-end bg-[#8B0000] hover:bg-[#6B0000] text-white font-bold rounded-lg px-6 py-2.5 transition-colors whitespace-nowrap"
        >
          Rechercher
        </button>
      </form>

      {!query && (
        <p className="text-gray-500 text-sm">
          Saisissez un ou plusieurs mots-clés puis validez pour lancer la
          recherche.
        </p>
      )}

      {query && error && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-gray-500 text-lg font-medium">
            Une erreur est survenue pendant la recherche. Réessayez plus tard.
          </p>
        </div>
      )}

      {query && !error && posts.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📰</div>
          <p className="text-gray-500 text-lg font-medium">
            Aucun article trouvé pour « {query} ».
          </p>
        </div>
      )}

      {query && !error && posts.length > 0 && (
        <>
          <p className="text-gray-500 text-sm mb-4">
            Résultats pour « {query} »
          </p>
          <ArticleInfiniteScroll
            initialPosts={posts}
            initialTotalPages={totalPages}
            search={query}
          />
        </>
      )}
    </div>
  );
}
