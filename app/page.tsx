import { getPosts, getCategories } from "@/lib/api";
import ArticleInfiniteScroll from "@/components/ArticleInfiniteScroll";

interface HomePageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedParams = await searchParams;
  const categoryId = resolvedParams.category
    ? parseInt(resolvedParams.category, 10)
    : undefined;

  const [{ posts, totalPages }, categories] = await Promise.all([
    getPosts({ page: 1, perPage: 22, categoryId }),
    getCategories(),
  ]);

  const activeCategoryData = categories.find((c) => c.id === categoryId);

  return (
    <div className="mt-4">
      {activeCategoryData && (
        <div className="mb-5">
          <h1 className="text-2xl font-black text-gray-900">
            {activeCategoryData.name}
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
          initialPosts={posts}
          initialTotalPages={totalPages}
          categoryId={categoryId}
        />
      )}
    </div>
  );
}
