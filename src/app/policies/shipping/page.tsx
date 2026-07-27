import type { Metadata } from "next";
import { PolicyPageLayout, generatePolicyMetadata } from "@/components/layout/PolicyPageLayout";
import { getShopPolicies, resolveLiquidVariables } from "@/lib/shopify";

export const metadata: Metadata = generatePolicyMetadata(
  "Shipping Policy",
  "Learn about shipping options and delivery times for MOSSÉ products."
);

export default async function ShippingPolicyPage() {
  const policies = await getShopPolicies();
  const policy = policies.shippingPolicy;

  const bodyHtml = policy
    ? resolveLiquidVariables(policy.body, {
        shop_name: "Mossé",
        email: "hello@mossewellness.com",
      })
    : undefined;

  return (
    <PolicyPageLayout
      title={policy?.title ?? "Shipping Policy"}
      bodyHtml={bodyHtml}
    />
  );
}
