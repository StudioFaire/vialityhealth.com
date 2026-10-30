"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { MARKET_LIST, isLocale } from "@/lib/markets";

export interface RevalidateConsoleInput {
  /** Cache tags to mark stale, e.g. `shopify-products`. */
  tags?: string[];
  /** Browser-facing paths to revalidate, e.g. `/shop` or `/uk/about`. */
  paths?: string[];
  /** Clear every page via `_N_T_/layout`, ignoring `paths`. */
  siteWide?: boolean;
}

export interface RevalidateConsoleResult {
  /** The tags actually invalidated (deduplicated). */
  tags: string[];
  /** The localized paths actually revalidated. */
  paths: string[];
  error?: string;
}

function isConsoleEnabled(): boolean {
  return process.env.ENABLE_REVALIDATE_CONSOLE === "true";
}

// Splits the free-text fields into entries: operators paste either `a, b` or one
// per line. Trims, drops blanks and de-duplicates.
function parseList(values: string[] | undefined): string[] {
  return [
    ...new Set(
      (values ?? [])
        .flatMap((value) => value.split(/[\n,]+/))
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  ];
}

// `trailingSlash` is a URL concern; route paths are recorded without one.
function stripTrailingSlash(path: string): string {
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

// Every page lives under `app/[locale]`, so a browser-facing path has to be
// resolved into the concrete route Next.js recorded. A path that already starts
// with a locale targets one market; anything else fans out to every market.
function toLocalePaths(path: string): string[] {
  const normalized = stripTrailingSlash(path.startsWith("/") ? path : `/${path}`);
  const [first = ""] = normalized.split("/");

  if (isLocale(first)) {
    return [normalized];
  }

  const tail = normalized === "/" ? "" : normalized;

  return MARKET_LIST.map(({ locale }) => stripTrailingSlash(`/${locale}${tail}`));
}

function invalidateTags(tags: string[]): string[] {
  for (const tag of tags) {
    // Mark stale and revalidate in the background; the same profile the
    // webhook helpers use for externally pushed changes.
    revalidateTag(tag, "max");
  }

  return tags;
}

/**
 * Applies the console's selections. Tags are marked stale; paths go through
 * `revalidatePath` with no `type`, because a concrete path is recorded as the
 * bare `_N_T_/<path>` tag and a `type` would target `_N_T_/<path>/page`, which
 * no entry carries.
 */
export async function revalidateConsole({
  tags,
  paths,
  siteWide = false,
}: RevalidateConsoleInput): Promise<RevalidateConsoleResult> {
  if (!isConsoleEnabled()) {
    return { tags: [], paths: [], error: "The revalidation console is disabled." };
  }

  const selectedTags = parseList(tags);
  const selectedPaths = parseList(paths);

  try {
    const invalidatedTags = invalidateTags(selectedTags);

    if (siteWide) {
      // `_N_T_/layout` is the tag every page carries, so this clears the site.
      revalidatePath("/", "layout");

      return { tags: invalidatedTags, paths: ["/ (layout)"] };
    }

    const revalidatedPaths = [...new Set(selectedPaths.flatMap(toLocalePaths))];

    for (const path of revalidatedPaths) {
      revalidatePath(path);
    }

    return { tags: invalidatedTags, paths: revalidatedPaths };
  } catch (error) {
    return {
      tags: [],
      paths: [],
      error: error instanceof Error ? error.message : "Revalidation failed.",
    };
  }
}
