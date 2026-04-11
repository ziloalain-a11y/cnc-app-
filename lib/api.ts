const WP_API_BASE =
  process.env.NEXT_PUBLIC_WP_API_URL ||
  "https://corbeaunews-centrafrique.org/wp-json/wp/v2";

export interface WPMedia {
  source_url: string;
  alt_text: string;
  media_details?: {
    sizes?: {
      thumbnail?: { source_url: string; width: number; height: number };
      medium?: { source_url: string; width: number; height: number };
      medium_large?: { source_url: string; width: number; height: number };
      large?: { source_url: string; width: number; height: number };
      full?: { source_url: string; width: number; height: number };
    };
  };
}

export interface WPTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
  link: string;
}

export interface WPAuthor {
  id: number;
  name: string;
  slug: string;
  avatar_urls?: { [size: string]: string };
}

export interface WPPost {
  id: number;
  date: string;
  modified: string;
  slug: string;
  status: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  link: string;
  _embedded?: {
    "wp:featuredmedia"?: WPMedia[];
    "wp:term"?: WPTerm[][];
    author?: WPAuthor[];
  };
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
  description: string;
  parent: number;
  link: string;
}

export interface PostsResponse {
  posts: WPPost[];
  totalPages: number;
  total: number;
}

export async function getPosts(
  params: {
    page?: number;
    perPage?: number;
    categoryId?: number;
    search?: string;
  } = {}
): Promise<PostsResponse> {
  const { page = 1, perPage = 12, categoryId, search } = params;

  const qs = new URLSearchParams({
    _embed: "wp:featuredmedia,wp:term,author",
    per_page: String(perPage),
    page: String(page),
    status: "publish",
  });

  if (categoryId) qs.set("categories", String(categoryId));
  if (search) qs.set("search", search);

  const res = await fetch(`${WP_API_BASE}/posts?${qs}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Erreur API WordPress: ${res.status} ${res.statusText}`);
  }

  const posts: WPPost[] = await res.json();
  const totalPages = parseInt(res.headers.get("X-WP-TotalPages") || "1", 10);
  const total = parseInt(res.headers.get("X-WP-Total") || "0", 10);

  return { posts, totalPages, total };
}

export async function getPost(id: number): Promise<WPPost> {
  const res = await fetch(
    `${WP_API_BASE}/posts/${id}?_embed=wp:featuredmedia,wp:term,author`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    throw new Error(`Article introuvable: ${res.status}`);
  }

  return res.json();
}

export async function getCategories(): Promise<WPCategory[]> {
  const res = await fetch(
    `${WP_API_BASE}/categories?per_page=50&orderby=count&order=desc&hide_empty=true`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    throw new Error(`Erreur chargement catégories: ${res.status}`);
  }

  return res.json();
}

export function getFeaturedImageUrl(
  post: WPPost,
  size: "thumbnail" | "medium" | "large" | "full" = "large"
): string | null {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  if (!media) return null;

  return (
    media.media_details?.sizes?.[size]?.source_url ||
    media.media_details?.sizes?.large?.source_url ||
    media.media_details?.sizes?.medium?.source_url ||
    media.source_url ||
    null
  );
}

export function getPostCategories(post: WPPost): WPTerm[] {
  return (post._embedded?.["wp:term"]?.[0] || []).filter(
    (t) => t.taxonomy === "category"
  );
}

export function getPostAuthor(post: WPPost): WPAuthor | null {
  return post._embedded?.author?.[0] || null;
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatDateRelative(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? "s" : ""}`;
  return formatDate(dateString);
}
