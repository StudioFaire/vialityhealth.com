import { NextRequest, NextResponse } from "next/server";
import {
  revalidateShopifyProducts,
  revalidateShopifyCollections,
} from "@/lib/shopify/revalidate";

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");

  if (REVALIDATE_SECRET && secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const topic = body.topic as string | undefined;

    if (topic?.includes("product")) {
      revalidateShopifyProducts();
    }
    if (topic?.includes("collection")) {
      revalidateShopifyCollections();
    }

    if (!topic) {
      revalidateShopifyProducts();
      revalidateShopifyCollections();
    }

    return NextResponse.json({ revalidated: true, topic });
  } catch {
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 }
    );
  }
}
