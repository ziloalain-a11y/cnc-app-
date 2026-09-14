import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ArticleInfiniteScroll from "@/components/ArticleInfiniteScroll";
import { getPosts, getPostAuthor } from "@/lib/api";

export const revalidate = 3600;

interface AuthorPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { id: idStr } = await params;
  const authorId = parseInt(idStr, 10);
  if (isNaN(authorId)) return { title: "Auteur introuvable | CNC" };

  try {
    const { posts } = await getPosts({ authorId, page: 1, perPage: 1 });
    const authorName = posts[0] ? getPostAuthor(posts[0])?.name : null;
    return {
      title: authorName ? `Articles de ${authorName} | CNC` : "Auteur | CNC",
    };
  } catch {
    return { title: "Auteur | CNC" };
  }
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { id: idStr } = await params;
  const authorId = parseInt(idStr, 10);
  if (isNaN(authorId)) notFound();

  let posts: Awaited<ReturnType<typeof getPosts>>["posts"] = [];
  let totalPages = 1;

  try {
    const result = await getPosts({ authorId, page: 1, perPage: 22 });
    posts = result.posts;
    totalPages = result.totalPages;
  } catch {
    // render with empty state below
  }

  const authorName = posts[0] ? getPostAuthor(posts[0])?.name : null;

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

      <h1 className="text-2xl font-black text-gray-900 mb-5">
        {authorName ? `Articles de ${authorName}` : "Articles de cet auteur"}
      </h1>

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📰</div>
          <p className="text-gray-500 text-lg font-medium">
            Aucun article trouvé pour cet auteur.
          </p>
        </div>
      ) : (
        <ArticleInfiniteScroll
          initialPosts={posts}
          initialTotalPages={totalPages}
          authorId={authorId}
        />
      )}
    </div>
  );
}
