import { unstable_cache } from "next/cache";
import { adminGraphQL } from "./admin";

const FREE_SHIPPING_DISCOUNT_ID =
  process.env.SHOPIFY_FREE_SHIPPING_DISCOUNT_ID ?? "1356928319628";

export type FreeShippingDiscount = {
  title: string | null;
  summary: string | null;
  status: string | null;
  threshold: number | null;
  currencyCode: string | null;
};

export type FreeShippingConfig = {
  text: string;
  threshold: number | null;
};

type DiscountNode = {
  discount:
    | {
        title: string | null;
        summary: string | null;
        status: string | null;
        minimumRequirement: {
          greaterThanOrEqualToSubtotal: {
            amount: string;
            currencyCode: string;
          };
        } | null;
      }
    | null;
};

type DiscountNodesResponse = {
  discountNodes: {
    edges: { node: DiscountNode }[];
  };
};

const GetFreeShippingDiscountQuery = /* GraphQL */ `
  query GetFreeShippingDiscount($query: String!) {
    discountNodes(first: 1, query: $query) {
      edges {
        node {
          discount {
            ... on DiscountAutomaticFreeShipping {
              title
              summary
              status
              minimumRequirement {
                ... on DiscountMinimumSubtotal {
                  greaterThanOrEqualToSubtotal {
                    amount
                    currencyCode
                  }
                }
              }
            }
            ... on DiscountCodeFreeShipping {
              title
              summary
              status
              minimumRequirement {
                ... on DiscountMinimumSubtotal {
                  greaterThanOrEqualToSubtotal {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

function formatCurrency(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

const getCachedDiscount = unstable_cache(
  async (): Promise<FreeShippingDiscount | null> => {
    try {
      const { discountNodes } = await adminGraphQL<DiscountNodesResponse>(
        GetFreeShippingDiscountQuery,
        { query: `id:${FREE_SHIPPING_DISCOUNT_ID}` }
      );
      const discount = discountNodes.edges[0]?.node.discount;
      if (!discount) return null;
      const subtotal =
        discount.minimumRequirement?.greaterThanOrEqualToSubtotal ?? null;
      return {
        title: discount.title,
        summary: discount.summary,
        status: discount.status,
        threshold: subtotal ? parseFloat(subtotal.amount) : null,
        currencyCode: subtotal?.currencyCode ?? null,
      };
    } catch {
      return null;
    }
  },
  ["shopify", "free-shipping-discount"],
  { revalidate: 300, tags: ["shopify-discounts"] }
);

export async function getFreeShippingConfig(): Promise<FreeShippingConfig | null> {
  const discount = await getCachedDiscount();
  if (!discount) return null;
  const { threshold, currencyCode, summary, title } = discount;
  const text =
    threshold != null && currencyCode
      ? `Free shipping on orders over ${formatCurrency(threshold, currencyCode)}`
      : summary || title || "";
  return {
    text,
    threshold: threshold ?? null,
  };
}
