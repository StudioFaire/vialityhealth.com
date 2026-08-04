export const ProductFragment = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    title
    handle
    description
    descriptionHtml
    productType
    options {
      id
      name
      values
    }
    variants(first: 10) {
      edges {
        node {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          sellingPlanAllocations(first: 5) {
            edges {
              node {
                sellingPlan {
                  id
                  name
                  priceAdjustments {
                    adjustmentValue {
                      ... on SellingPlanPercentagePriceAdjustment {
                        adjustmentPercentage
                      }
                      ... on SellingPlanFixedAmountPriceAdjustment {
                        adjustmentAmount {
                          amount
                          currencyCode
                        }
                      }
                      ... on SellingPlanFixedPriceAdjustment {
                        price {
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
      }
    }
    sellingPlanGroups(first: 5) {
      edges {
        node {
          name
          sellingPlans(first: 5) {
            edges {
              node {
                id
                name
                priceAdjustments {
                  adjustmentValue {
                    ... on SellingPlanPercentagePriceAdjustment {
                      adjustmentPercentage
                    }
                    ... on SellingPlanFixedAmountPriceAdjustment {
                      adjustmentAmount {
                        amount
                        currencyCode
                      }
                    }
                    ... on SellingPlanFixedPriceAdjustment {
                      price {
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
    }
    images(first: 5) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    tags
    publishedAt
    fullNameMetafield: metafield(namespace: "custom", key: "full_name") {
      value
    }
    shortNameMetafield: metafield(namespace: "custom", key: "short_name") {
      value
    }
  }
`;

export const GetAllProductsQuery = /* GraphQL */ `
  ${ProductFragment}
  query GetAllProducts($first: Int!) {
    products(first: $first, sortKey: BEST_SELLING) {
      edges {
        node {
          ...ProductFields
        }
      }
    }
  }
`;

export const GetProductByHandleQuery = /* GraphQL */ `
  ${ProductFragment}
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      ...ProductFields
    }
  }
`;

export const GetCollectionByIdentifierQuery = /* GraphQL */ `
  ${ProductFragment}
  query GetCollectionByIdentifier($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      products(first: $first) {
        edges {
          node {
            ...ProductFields
          }
        }
      }
    }
  }
`;

export const GetAllCollectionsQuery = /* GraphQL */ `
  query GetAllCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
        }
      }
    }
  }
`;

export const GetCartQuery = /* GraphQL */ `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      totalQuantity
      cost {
        subtotalAmount {
          amount
          currencyCode
        }
        totalAmount {
          amount
          currencyCode
        }
      }
      lines(first: 50) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                product {
                  title
                  handle
                  images(first: 1) {
                    edges {
                      node {
                        url
                        altText
                      }
                    }
                  }
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GetShopPoliciesQuery = /* GraphQL */ `
  query GetShopPolicies {
    shop {
      refundPolicy {
        title
        handle
        body
        url
      }
      privacyPolicy {
        title
        handle
        body
        url
      }
      termsOfService {
        title
        handle
        body
        url
      }
      shippingPolicy {
        title
        handle
        body
        url
      }
      contactInformation {
        title
        handle
        body
        url
      }
      legalNotice {
        title
        handle
        body
        url
      }
      subscriptionPolicy {
        title
        handle
        body
        url
      }
    }
  }
`;

export const GetMenuQuery = /* GraphQL */ `
  query GetMenu($handle: String!) {
    menu(handle: $handle) {
      id
      items {
        id
        title
        url
      }
    }
  }
`;
