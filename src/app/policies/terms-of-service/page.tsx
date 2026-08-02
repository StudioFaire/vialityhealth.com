import type { Metadata } from "next";
import { PolicyPageLayout, generatePolicyMetadata } from "@/components/layout/PolicyPageLayout";
import { getShopPolicies, resolveLiquidVariables } from "@/lib/shopify";

export const metadata: Metadata = generatePolicyMetadata(
  "Terms of Service",
  "Review the terms and conditions governing your use of the Viality website and services."
);

export default async function TermsOfServicePage() {
  const policies = await getShopPolicies();
  const policy = policies.termsOfService;

  const bodyHtml = policy
    ? resolveLiquidVariables(policy.body, {
      shop_name: "Mossé",
      email: "hello@vialityhealth.com",
    })
    : undefined;

  return (
    <PolicyPageLayout
      title={policy?.title ?? "Terms of Service"}
      bodyHtml={bodyHtml}
    />
  );
}
