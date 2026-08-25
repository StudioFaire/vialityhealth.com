import { decryptAndReverse } from "@/lib/crypto";
import type { ShopifyProduct } from "@/lib/shopify/types";

const STATIC_REPLACEMENTS: [string, string][] = [
  ["{{m}}", "melanocortin"],
  ["{{np}}", "neuropeptide"],
  ["{{MC_3_and_4_R}}", "MC3R and MC4R"],
  ["{{p}}", "peptide"],
  ["{{sp}}", "synthetic peptide"],
  ["{{pre}}", "preclinical"],
  ["{{syn}}", "synthetic"],
  ["{{act}}", "ACTH"],
  ["{{sc}}", "stem cell"],
  ["{{cr}}", "controlled research"],
];

export function applyStaticReplacements(text: string): string {
  let result = String(text ?? "");
  for (const [token, value] of STATIC_REPLACEMENTS) {
    result = result.replaceAll(token, value);
  }
  return result.replace(/<br\s*\/?>/g, "").replace(/<span><\/span>/g, "");
}

export function resolveProductDescription(product: ShopifyProduct): string {
  const fullName = product.full_name ? decryptAndReverse(product.full_name) : "";
  const shortName = product.short_name ? decryptAndReverse(product.short_name) : "";

  return applyStaticReplacements(product.descriptionHtml || product.description)
    .replaceAll("{{full_name}}", fullName)
    .replaceAll("{{short_name}}", shortName);
}

export function getFirstParagraph(text: string): string {
  const html = String(text ?? "");
  const match = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  const source = match ? match[1] : html;
  return source
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<[^>]*>/g, "")
    .split(/\r?\n/)[0]
    .replace(/\s+/g, " ")
    .trim();
}

export function resolveProductDescriptionText(product: ShopifyProduct): string {
  return getFirstParagraph(resolveProductDescription(product));
}

export function resolveProductMetaTitle(product: ShopifyProduct): string {
  const shortName = product.short_name ? decryptAndReverse(product.short_name) : "";
  return shortName || product.title;
}

export function resolveProductMetaDescription(product: ShopifyProduct): string {
  const resolved = resolveProductDescriptionText(product);
  return resolved.length > 160 ? resolved.slice(0, 157) + "..." : resolved;
}
