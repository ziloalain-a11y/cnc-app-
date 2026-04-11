import { getPosts } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("perPage") || "22", 10);
  const categoryId = searchParams.get("category")
    ? parseInt(searchParams.get("category")!, 10)
    : undefined;

  try {
    const result = await getPosts({ page, perPage, categoryId });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Erreur API" }, { status: 500 });
  }
}
