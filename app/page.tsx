import { getPosts } from "@/lib/api";
import HomeClient from "@/components/HomeClient";
import { Suspense } from "react";

export default async function HomePage() {
  let initialPosts: Awaited<ReturnType<typeof getPosts>>["posts"] = [];
  let initialTotalPages = 1;

  try {
    const result = await getPosts({ page: 1, perPage: 22 });
    initialPosts = result.posts;
    initialTotalPages = result.totalPages;
  } catch {
    // render with empty state — client will handle retry
  }

  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <div className="flex items-center gap-3 text-gray-500">
            <div className="w-6 h-6 border-2 border-[#8B0000] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">Chargement…</span>
          </div>
        </div>
      }
    >
      <HomeClient
        initialPosts={initialPosts}
        initialTotalPages={initialTotalPages}
      />
    </Suspense>
  );
}
