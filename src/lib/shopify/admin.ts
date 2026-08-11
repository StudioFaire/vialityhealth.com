export const ADMIN_API_VERSION = "2026-07";

let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getAdminAccessToken(): Promise<string> {
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

export async function adminGraphQL<T>(
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
