import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getPost,
  getFeaturedImageUrl,
  getPostCategories,
  getPostAuthor,
  formatDate,
  stripHtml,
} from "@/lib/api";

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  const WP_API_BASE =
    process.env.NEXT_PUBLIC_WP_API_URL ||
    "https://corbeaunews-centrafrique.org/wp-json/wp/v2";

  try {
    const res = await fetch(
      `${WP_API_BASE}/posts?per_page=50&page=1&status=publish&orderby=date&order=desc&_fields=id`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const posts: { id: number }[] = await res.json();
    return posts.map((p) => ({ id: String(p.id) }));
  } catch {
    return [];
  }
}

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);
  if (isNaN(id)) return { title: "Article introuvable | CNC" };

  try {
    const post = await getPost(id);
    const imageUrl = getFeaturedImageUrl(post, "large");
    const title = stripHtml(post.title.rendered);
    const description = stripHtml(post.excerpt.rendered).slice(0, 160);

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: imageUrl ? [{ url: imageUrl }] : [],
        type: "article",
        publishedTime: post.date,
        modifiedTime: post.modified,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch {
    return { title: "Article | CNC" };
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);
  if (isNaN(id)) notFound();

  let post;
  try {
    post = await getPost(id);
  } catch {
    notFound();
  }

  const imageUrl = getFeaturedImageUrl(post, "full");
  const categories = getPostCategories(post);
  const author = getPostAuthor(post);
  const title = stripHtml(post.title.rendered);

  return (
    <article className="max-w-4xl mx-auto pb-12">
      {/* Back navigation */}
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

      {/* Category badges */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/?category=${cat.id}`}
              className="bg-[#8B0000] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider hover:bg-[#6B0000] transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      {/* Title */}
      <h1
        className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 leading-tight mb-5"
        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
      />

      {/* Meta: author + date */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
        {author && (
          <>
            <span className="flex items-center gap-1.5">
              <svg
                width="14"
                height="14"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
              <span className="font-semibold text-gray-700">{author.name}</span>
            </span>
            <span className="text-gray-300">·</span>
          </>
        )}
        <time dateTime={post.date} className="flex items-center gap-1.5">
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {formatDate(post.date)}
        </time>
        {post.modified !== post.date && (
          <>
            <span className="text-gray-300">·</span>
            <span className="text-xs text-gray-400">
              Mis à jour le {formatDate(post.modified)}
            </span>
          </>
        )}
      </div>

      {/* Featured image */}
      {imageUrl && (
        <figure className="relative w-full rounded-xl overflow-hidden mb-8 shadow-lg">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
            />
          </div>
        </figure>
      )}

      {/* Article content */}
      <div
        className="wp-content"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />

      {/* Share bar */}
      <div className="mt-10 pt-8 border-t border-gray-200">
        <p className="text-sm font-bold text-gray-700 mb-3">
          Partager cet article
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(post.link)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#1877F2] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z" />
            </svg>
            Facebook
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(post.link)}&text=${encodeURIComponent(title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-black text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            X / Twitter
          </a>
          <a
            href={`whatsapp://send?text=${encodeURIComponent(title + " — " + post.link)}`}
            className="flex items-center gap-2 bg-[#25D366] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
        </div>
      </div>

      {/* Back to home */}
      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#8B0000] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#6B0000] transition-colors"
        >
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Voir toutes les actualités
        </Link>
      </div>
    </article>
  );
}