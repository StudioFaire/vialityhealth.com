import type { Metadata } from "next";
import { PolicyPageLayout } from "@/components/layout/PolicyPageLayout";
import { generatePolicyMetadata } from "@/components/layout/policy-metadata";
import { getShopPolicies, resolveLiquidVariables } from "@/lib/shopify";

export const metadata: Metadata = generatePolicyMetadata(
  "Cancellation Policy",
  "Learn about subscription and order cancellation options at Viality.",
);

export default async function CancellationPolicyPage() {
  const policies = await getShopPolicies();
  const policy = policies.subscriptionPolicy;

  const bodyHtml = policy
    ? resolveLiquidVariables(policy.body, {
        shop_name: "Mossé",
        email: "hello@vialityhealth.com",
      })
    : undefined;

  return <PolicyPageLayout title={policy?.title ?? "Cancellation Policy"} bodyHtml={bodyHtml} />;
}
