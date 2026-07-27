import type { Metadata } from "next";
import { PolicyPageLayout, generatePolicyMetadata } from "@/components/layout/PolicyPageLayout";
import { getShopPolicies, resolveLiquidVariables } from "@/lib/shopify";

export const metadata: Metadata = generatePolicyMetadata(
  "Legal Notice",
  "Important legal information regarding the MOSSÉ website and products."
);

export default async function LegalNoticePage() {
  const policies = await getShopPolicies();
  const policy = policies.legalNotice;

  const bodyHtml = policy
    ? resolveLiquidVariables(policy.body, {
        shop_name: "Mossé",
        email: "hello@mossewellness.com",
      })
    : undefined;

  return (
    <PolicyPageLayout
      title={policy?.title ?? "Legal Notice"}
      bodyHtml={bodyHtml}
    />
  );
}
