import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  revalidateShopifyProducts,
  revalidateShopifyCollections,
} from "@/lib/shopify/revalidate";

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;
const WEBHOOK_SECRET = process.env.SHOPIFY_CLIENT_SECRET;

// Shopify webhooks deliver the topic via the X-Shopify-Topic header and sign
// the raw body with HMAC-SHA256 using the app client secret.
function verifyShopifyHmac(rawBody: Buffer, signature: string | null): boolean {
  if (!WEBHOOK_SECRET || !signature) return false;
  const expected = createHmac("sha256", WEBHOOK_SECRET)
    .update(rawBody)
    .digest("base64");
  const expectedBuf = Buffer.from(expected);
  const receivedBuf = Buffer.from(signature);
  return (
    expectedBuf.length === receivedBuf.length &&
    timingSafeEqual(expectedBuf, receivedBuf)
  );
}

export async function POST(request: NextRequest) {
  const rawBody = Buffer.from(await request.arrayBuffer());

  const shopifySignature = request.headers.get("x-shopify-hmac-sha256");
  const isShopifyWebhook = shopifySignature !== null;

  const valid =
    isShopifyWebhook
      ? verifyShopifyHmac(rawBody, shopifySignature)
      : !REVALIDATE_SECRET ||
        request.headers.get("x-revalidate-secret") === REVALIDATE_SECRET;

  if (!valid) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let topic = request.headers.get("x-shopify-topic") ?? "";
  if (!topic) {
    try {
      const body = JSON.parse(rawBody.toString("utf8")) as { topic?: string };
      topic = body.topic ?? "";
    } catch {
      // fall through to full revalidation below
    }
  }

  try {
    if (topic.includes("collection")) {
      revalidateShopifyCollections();
    } else if (topic.includes("product") || topic.includes("metafield")) {
      revalidateShopifyProducts();
    } else {
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
