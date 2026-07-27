import type { Metadata } from "next";
import { PolicyPageLayout, generatePolicyMetadata } from "@/components/layout/PolicyPageLayout";
import { getShopPolicies, resolveLiquidVariables } from "@/lib/shopify";

export const metadata: Metadata = generatePolicyMetadata(
  "Contact Information",
  "Get in touch with the MOSSÉ team."
);

export default async function ContactInformationPage() {
  const policies = await getShopPolicies();
  const policy = policies.contactInformation;

  const bodyHtml = policy
    ? resolveLiquidVariables(policy.body, {
        shop_name: "Mossé",
        email: "hello@mossewellness.com",
      })
    : undefined;

  return (
    <PolicyPageLayout
      title={policy?.title ?? "Contact Information"}
      bodyHtml={bodyHtml}
    />
  );
}
