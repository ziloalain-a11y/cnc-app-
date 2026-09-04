"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ArticleInfiniteScroll from "@/components/ArticleInfiniteScroll";
import type { WPPost } from "@/lib/api";

interface HomeClientProps {
  initialPosts: WPPost[];
  initialTotalPages: number;
}

export default function HomeClient({
  initialPosts,
  initialTotalPages,
}: HomeClientProps) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const categoryId = categoryParam ? parseInt(categoryParam, 10) : undefined;

  const [posts, setPosts] = useState<WPPost[]>(initialPosts);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);
  const [activeCategoryName, setActiveCategoryName] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) {
      setPosts(initialPosts);
      setTotalPages(initialTotalPages);
      setActiveCategoryName(null);
      return;
    }

    const WP_API_BASE =
      process.env.NEXT_PUBLIC_WP_API_URL ||
      "https://corbeaunews-centrafrique.org/wp-json/wp/v2";

    setLoading(true);
    const qs = new URLSearchParams({
      _embed: "wp:featuredmedia,wp:term,author",
      per_page: "22",
      page: "1",
      status: "publish",
      categories: String(categoryId),
    });

    Promise.all([
      fetch(`${WP_API_BASE}/posts?${qs}`).then(async (res) => {
        const newPosts: WPPost[] = await res.json();
        const pages = parseInt(res.headers.get("X-WP-TotalPages") || "1", 10);
        return { newPosts, pages };
      }),
      fetch(
        `${WP_API_BASE}/categories/${categoryId}?_fields=name`
      ).then((res) => res.json()),
    ])
      .then(([{ newPosts, pages }, cat]) => {
        setPosts(newPosts);
        setTotalPages(pages);
        setActiveCategoryName(cat?.name ?? null);
      })
      .catch(() => {
        setPosts([]);
        setTotalPages(1);
      })
      .finally(() => setLoading(false));
  }, [categoryId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-6 h-6 border-2 border-[#8B0000] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Chargement…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {activeCategoryName && (
        <div className="mb-5">
          <h1 className="text-2xl font-black text-gray-900">
            {activeCategoryName}
          </h1>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📰</div>
          <p className="text-gray-500 text-lg font-medium">
            Aucun article disponible pour le moment.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Revenez plus tard ou vérifiez votre connexion.
          </p>
        </div>
      ) : (
        <ArticleInfiniteScroll
          key={categoryId ?? 0}
          initialPosts={posts}
          initialTotalPages={totalPages}
          categoryId={categoryId}
        />
      )}
    </div>
  );
}
