import { decryptAndReverse } from "@/lib/crypto";
import type { ShopifyProduct } from "@/lib/shopify/types";

export function resolveProductDescription(product: ShopifyProduct): string {
  const fullName = product.full_name ? decryptAndReverse(product.full_name) : "";
  const shortName = product.short_name ? decryptAndReverse(product.short_name) : "";

  return (product.descriptionHtml || product.description)
    .replaceAll("{{np}}", "neuropeptide")
    .replaceAll("{{p}}", "peptide")
    .replaceAll("{{sp}}", "synthetic peptide")
    .replaceAll("{{pre}}", "preclinical")
    .replaceAll("{{syn}}", "synthetic")
    .replaceAll("{{act}}", "ACTH")
    .replaceAll("{{sc}}", "stem cell")
    .replaceAll("{{cr}}", "controlled research")
    .replaceAll("{{full_name}}", fullName)
    .replaceAll("{{short_name}}", shortName)
    .replace(/<br\s*\/?>/g, "")
    .replace(/<span><\/span>/g, "");
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
