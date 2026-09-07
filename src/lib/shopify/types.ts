export type ShopifyImage = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

type ShopifyPrice = {
  amount: string;
  currencyCode: string;
};

type ShopifySellingPlan = {
  id: string;
  name: string;
  priceAdjustments: {
    adjustmentValue:
      | { adjustmentPercentage: number }
      | { adjustmentAmount: ShopifyPrice }
      | { price: ShopifyPrice };
  }[];
};

type ShopifySellingPlanAllocation = {
  sellingPlan: ShopifySellingPlan;
};

export type ShopifyProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyPrice;
  compareAtPrice: ShopifyPrice | null;
  selectedOptions: { name: string; value: string }[];
  sellingPlanAllocations: {
    edges: { node: ShopifySellingPlanAllocation }[];
  };
};

type ShopifySellingPlanGroup = {
  name: string;
  sellingPlans: {
    edges: { node: ShopifySellingPlan }[];
  };
};

type ShopifyProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ShopifyProductRaw = {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  options: ShopifyProductOption[];
  variants: {
    edges: { node: ShopifyProductVariant }[];
  };
  sellingPlanGroups: {
    edges: { node: ShopifySellingPlanGroup }[];
  };
  images: {
    edges: { node: ShopifyImage }[];
  };
  priceRange: {
    minVariantPrice: ShopifyPrice;
    maxVariantPrice: ShopifyPrice;
  };
  compareAtPriceRange: {
    minVariantPrice: ShopifyPrice;
  };
  tags: string[];
  publishedAt: string;
  fullNameMetafield?: {
    value: string;
  } | null;
  shortNameMetafield?: {
    value: string;
  } | null;
  fullImageUrlMetafield?: {
    value: string;
  } | null;
  summaryMetafield?: {
    value: string;
  } | null;
};

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  options: ShopifyProductOption[];
  variants: {
    edges: { node: ShopifyProductVariant }[];
  };
  sellingPlanGroups: {
    edges: { node: ShopifySellingPlanGroup }[];
  };
  images: {
    edges: { node: ShopifyImage }[];
  };
  priceRange: {
    minVariantPrice: ShopifyPrice;
    maxVariantPrice: ShopifyPrice;
  };
  compareAtPriceRange: {
    minVariantPrice: ShopifyPrice;
  };
  tags: string[];
  publishedAt: string;
  full_name?: string;
  short_name?: string;
  full_image_url?: string;
  summary?: string;
};

export type ShopifyCartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: ShopifyPrice;
    product: {
      title: string;
      handle: string;
      images: {
        edges: { node: { url: string; altText: string | null } }[];
      };
    };
    selectedOptions: { name: string; value: string }[];
  };
  sellingPlanAllocation?: {
    sellingPlan: {
      id: string;
      name: string;
    };
  } | null;
};

export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyPrice;
    totalAmount: ShopifyPrice;
  };
  lines: {
    edges: { node: ShopifyCartLine }[];
  };
};

export type ShopifyCollection = {
  id: string;
  title: string;
  handle: string;
  description: string;
  products: {
    edges: { node: ShopifyProduct }[];
  };
};

type ShopifyMenuItem = {
  id: string;
  title: string;
  url: string;
};

export type ShopifyMenu = {
  id: string;
  title: string;
  items: ShopifyMenuItem[];
};

type ShopifyShopPolicy = {
  title: string;
  handle: string;
  body: string;
  url: string;
};

export type ShopPolicies = {
  refundPolicy: ShopifyShopPolicy | null;
  privacyPolicy: ShopifyShopPolicy | null;
  termsOfService: ShopifyShopPolicy | null;
  shippingPolicy: ShopifyShopPolicy | null;
  contactInformation: ShopifyShopPolicy | null;
  legalNotice: ShopifyShopPolicy | null;
  subscriptionPolicy: ShopifyShopPolicy | null;
};
