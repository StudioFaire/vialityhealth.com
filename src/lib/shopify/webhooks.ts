import { adminGraphQL } from "./admin";

export const WEBHOOK_TOPICS = [
  "PRODUCTS_CREATE",
  "PRODUCTS_UPDATE",
  "PRODUCTS_DELETE",
  "COLLECTIONS_CREATE",
  "COLLECTIONS_UPDATE",
  "COLLECTIONS_DELETE",
] as const;

type WebhookSubscriptionNode = {
  id: string;
  topic: string;
  endpoint: { callbackUrl: string } | null;
};

type GetWebhooksResponse = {
  webhookSubscriptions: {
    edges: { node: WebhookSubscriptionNode }[];
  };
};

type CreateWebhookResponse = {
  webhookSubscriptionCreate: {
    userErrors: { field: string[] | null; message: string }[];
    webhookSubscription: { id: string } | null;
  };
};

const GetWebhookSubscriptionsQuery = /* GraphQL */ `
  query GetWebhookSubscriptions {
    webhookSubscriptions(first: 50) {
      edges {
        node {
          id
          topic
          endpoint {
            ... on WebhookHttpEndpoint {
              callbackUrl
            }
          }
        }
      }
    }
  }
`;

const CreateWebhookSubscriptionMutation = /* GraphQL */ `
  mutation CreateWebhookSubscription($topic: WebhookSubscriptionTopic!, $callbackUrl: URL!) {
    webhookSubscriptionCreate(
      topic: $topic
      webhookSubscription: { callbackUrl: $callbackUrl, format: JSON }
    ) {
      userErrors {
        field
        message
      }
      webhookSubscription {
        id
      }
    }
  }
`;

export function getWebhookCallbackUrl(): string {
  const appUrl =
    process.env.SHOPIFY_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  if (!appUrl) {
    throw new Error("SHOPIFY_APP_URL is not configured (e.g. https://vialityhealth.com)");
  }
  return `${appUrl.replace(/\/$/, "")}/api/revalidate`;
}

export async function registerWebhookSubscriptions(): Promise<{
  created: string[];
  alreadyRegistered: string[];
}> {
  const callbackUrl = getWebhookCallbackUrl();

  const { webhookSubscriptions } = await adminGraphQL<GetWebhooksResponse>(
    GetWebhookSubscriptionsQuery,
    {},
  );

  const existing = new Map<string, string>();
  for (const edge of webhookSubscriptions.edges) {
    if (edge.node.endpoint) {
      existing.set(edge.node.topic, edge.node.endpoint.callbackUrl);
    }
  }

  const created: string[] = [];
  const alreadyRegistered: string[] = [];

  for (const topic of WEBHOOK_TOPICS) {
    if (existing.get(topic) === callbackUrl) {
      alreadyRegistered.push(topic);
      continue;
    }

    const { webhookSubscriptionCreate } = await adminGraphQL<CreateWebhookResponse>(
      CreateWebhookSubscriptionMutation,
      {
        topic,
        callbackUrl,
      },
    );

    if (webhookSubscriptionCreate.userErrors.length > 0) {
      throw new Error(
        `${topic}: ${webhookSubscriptionCreate.userErrors.map((e) => e.message).join(", ")}`,
      );
    }
    created.push(topic);
  }

  return { created, alreadyRegistered };
}
