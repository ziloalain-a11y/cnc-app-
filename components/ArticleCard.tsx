import Image from "next/image";
import Link from "next/link";
import { WPPost, getFeaturedImageUrl, getPostCategories, stripHtml } from "@/lib/api";

interface ArticleCardProps {
  post: WPPost;
  featured?: boolean;
}

export default function ArticleCard({ post, featured = false }: ArticleCardProps) {
  const imageUrl = getFeaturedImageUrl(post, "large");
  const categories = getPostCategories(post);
  const primaryCategory = categories[0];
  const title = stripHtml(post.title.rendered);

  return (
    <Link href={`/article/${post.id}`} className="block group">
      <article
        className="relative rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 bg-gray-900"
        style={{ minHeight: featured ? "320px" : "220px" }}
      >
        <div
          className="relative w-full"
          style={{ height: featured ? "320px" : "220px" }}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes={
                featured
                  ? "(max-width: 768px) 100vw, 80vw"
                  : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              }
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#8B0000] to-red-900 flex items-center justify-center">
              <span className="text-white text-6xl font-black opacity-20 select-none">
                CNC
              </span>
            </div>
          )}

          {/* Overlay sombre dégradé bas */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

          {/* Badge catégorie */}
          {primaryCategory && (
            <span className="absolute top-3 left-3 bg-[#8B0000] text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider shadow">
              {primaryCategory.name}
            </span>
          )}

          {/* Titre en blanc en bas */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h2
              className={`text-white font-bold leading-snug drop-shadow-lg ${
                featured
                  ? "text-xl md:text-2xl line-clamp-3"
                  : "text-sm md:text-base line-clamp-3"
              }`}
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
          </div>
        </div>
      </article>
    </Link>
  );
}
