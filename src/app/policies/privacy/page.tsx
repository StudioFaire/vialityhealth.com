import type { Metadata } from "next";
import { PolicyPageLayout, generatePolicyMetadata } from "@/components/layout/PolicyPageLayout";
import { getShopPolicies, resolveLiquidVariables } from "@/lib/shopify";

export const metadata: Metadata = generatePolicyMetadata(
  "Privacy Policy",
  "Learn how MOSSÉ collects, uses, and protects your personal information."
);

export default async function PrivacyPolicyPage() {
  const policies = await getShopPolicies();
  const policy = policies.privacyPolicy;

  const bodyHtml = policy
    ? resolveLiquidVariables(policy.body, {
        shop_name: "Mossé",
        email: "hello@mossewellness.com",
        phone: "",
        address: "",
        last_updated: "July 2026",
        data_sale_opt_out_page_url: "#",
      })
    : undefined;

  return (
    <PolicyPageLayout
      title={policy?.title ?? "Privacy Policy"}
      bodyHtml={bodyHtml}
    />
  );
}
