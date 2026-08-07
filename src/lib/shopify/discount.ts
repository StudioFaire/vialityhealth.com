import { unstable_cache } from "next/cache";

const FREE_SHIPPING_DISCOUNT_ID =
  process.env.SHOPIFY_FREE_SHIPPING_DISCOUNT_ID ?? "1356928319628";
const ADMIN_API_VERSION = "2026-07";

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

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAdminAccessToken(): Promise<string> {
  const shopDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;
  if (!shopDomain || !clientId || !clientSecret) {
    throw new Error("Shopify Admin API credentials are not configured");
  }
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }
  const response = await fetch(`https://${shopDomain}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  if (!response.ok) {
    throw new Error(`Shopify Admin token request failed: ${response.status}`);
  }
  const data = (await response.json()) as {
    access_token: string;
    expires_in?: number;
  };
  if (!data.access_token) {
    throw new Error("Shopify Admin token request returned no access token");
  }
  const expiresIn = data.expires_in ?? 86399;
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + expiresIn * 1000,
  };
  return data.access_token;
}

async function adminGraphQL<T>(
  query: string,
  variables: Record<string, unknown>
): Promise<T> {
  const shopDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  if (!shopDomain) {
    throw new Error("Shopify store domain is not configured");
  }
  const token = await getAdminAccessToken();
  const response = await fetch(
    `https://${shopDomain}/admin/api/${ADMIN_API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
    }
  );
  if (!response.ok) {
    throw new Error(`Shopify Admin GraphQL request failed: ${response.status}`);
  }
  const body = (await response.json()) as {
    data?: T;
    errors?: { message: string }[];
  };
  if (body.errors?.length) {
    throw new Error(
      `Shopify Admin GraphQL errors: ${body.errors
        .map((e) => e.message)
        .join(", ")}`
    );
  }
  if (!body.data) {
    throw new Error("Shopify Admin GraphQL request returned no data");
  }
  return body.data;
}

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
