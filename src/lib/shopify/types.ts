export type ShopifyImage = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

export type ShopifyPrice = {
  amount: string;
  currencyCode: string;
};

export type ShopifyProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyPrice;
  compareAtPrice: ShopifyPrice | null;
  selectedOptions: { name: string; value: string }[];
};

export type ShopifyProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  productType: string;
  options: ShopifyProductOption[];
  variants: {
    edges: { node: ShopifyProductVariant }[];
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

// Helper to extract product images
export function getProductImages(product: ShopifyProduct): ShopifyImage[] {
  return product.images.edges.map((e) => e.node);
}

// Helper to get first image
export function getProductImage(product: ShopifyProduct): ShopifyImage | null {
  return product.images.edges[0]?.node ?? null;
}

// Helper to get all variants
export function getProductVariants(
  product: ShopifyProduct
): ShopifyProductVariant[] {
  return product.variants.edges.map((e) => e.node);
}

// Helper to get product price as number
export function getPrice(price: ShopifyPrice): number {
  return parseFloat(price.amount);
}

// Helper to format price for display
export function formatPrice(price: ShopifyPrice): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currencyCode,
  }).format(parseFloat(price.amount));
}

// Helper to get cart lines
export function getCartLines(cart: ShopifyCart): ShopifyCartLine[] {
  return cart.lines.edges.map((e) => e.node);
}
