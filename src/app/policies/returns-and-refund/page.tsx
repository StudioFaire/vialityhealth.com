import type { Metadata } from "next";
import { PolicyPageLayout, generatePolicyMetadata } from "@/components/layout/PolicyPageLayout";
import { getShopPolicies, resolveLiquidVariables } from "@/lib/shopify";

export const metadata: Metadata = generatePolicyMetadata(
  "Return & Refund Policy",
  "Learn about MOSSÉ's return and refund policy."
);

export default async function ReturnsAndRefundPolicyPage() {
  const policies = await getShopPolicies();
  const policy = policies.refundPolicy;

  const bodyHtml = policy
    ? resolveLiquidVariables(policy.body, {
        shop_name: "Mossé",
        email: "hello@mossewellness.com",
      })
    : undefined;

  return (
    <PolicyPageLayout
      title={policy?.title ?? "Refund Policy"}
      bodyHtml={bodyHtml}
    />
  );
}
