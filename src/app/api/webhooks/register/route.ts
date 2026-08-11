import { NextRequest, NextResponse } from "next/server";
import { registerWebhookSubscriptions } from "@/lib/shopify/webhooks";

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

// Registers Shopify webhooks that trigger cache revalidation.
// Usage: curl -X POST https://<app-url>/api/webhooks/register \
//   -H "x-revalidate-secret: <REVALIDATE_SECRET>" \
//   -H "Content-Type: application/json" -d "{}"
export async function POST(request: NextRequest) {
  if (REVALIDATE_SECRET) {
    const secret = request.headers.get("x-revalidate-secret");
    if (secret !== REVALIDATE_SECRET) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }
  }

  try {
    const result = await registerWebhookSubscriptions();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
