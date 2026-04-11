"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ArticleCard from "@/components/ArticleCard";
import type { WPPost } from "@/lib/api";

interface ArticleInfiniteScrollProps {
  initialPosts: WPPost[];
  initialTotalPages: number;
  categoryId?: number;
}

export default function ArticleInfiniteScroll({
  initialPosts,
  initialTotalPages,
  categoryId,
}: ArticleInfiniteScrollProps) {
  const [posts, setPosts] = useState<WPPost[]>(initialPosts);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialTotalPages > 1);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        perPage: "22",
      });
      if (categoryId) params.set("category", String(categoryId));

      const res = await fetch(`/api/posts?${params}`);
      if (!res.ok) throw new Error("Erreur réseau");

      const data = await res.json();
      setPosts((prev) => [...prev, ...data.posts]);
      setPage((p) => p + 1);
      if (page >= data.totalPages) setHasMore(false);
    } catch {
      // silently fail — user can scroll again to retry
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, categoryId]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "300px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post, index) => (
          <ArticleCard
            key={post.id}
            post={post}
            featured={index === 0 && !categoryId}
          />
        ))}
      </div>

      {/* Sentinel pour l'infinite scroll */}
      <div ref={sentinelRef} className="h-8 mt-4" />

      {/* Indicateur de chargement */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-3 text-gray-500">
            <div className="w-5 h-5 border-2 border-[#8B0000] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">Chargement des articles…</span>
          </div>
        </div>
      )}

      {/* Fin des articles */}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-10 text-gray-400 text-sm">
          — Tous les articles ont été chargés —
        </div>
      )}
    </>
  );
}
