import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SHOPIFY_TAGS } from "@/lib/shopify/tags";

import { RevalidateConsole, type ConsoleGroup } from "./_components/revalidate-console";

export const metadata: Metadata = {
  title: "Cache revalidation console",
  robots: { index: false, follow: false },
};

// The env gate has to be read per request: baking it in at build time would
// leave the route 404ing after the flag is enabled, until the next deploy.
export const dynamic = "force-dynamic";

const TAG_GROUPS: ConsoleGroup[] = [
  {
    legend: "Shopify",
    options: Object.values(SHOPIFY_TAGS).map((tag) => ({ label: tag, value: tag })),
  },
];

const toOptions = (paths: string[]) => paths.map((path) => ({ label: path, value: path }));

/**
 * The site's top-level routes. Unprefixed, so each fans out to every market.
 * Curated rather than derived: there is no route manifest to read, and a stale
 * list is more useful than none. Product detail routes are dynamic — revalidate
 * those by pasting the concrete `/product/<handle>` path into "Additional paths".
 */
const ROUTE_GROUPS: ConsoleGroup[] = [
  {
    legend: "Storefront",
    options: toOptions(["/", "/shop"]),
  },
  {
    legend: "Content",
    options: toOptions(["/about", "/calculator", "/contact", "/crypto", "/faqs", "/lab-reports"]),
  },
  {
    legend: "Policies",
    options: toOptions([
      "/policies/cancellation-policy",
      "/policies/contact-information",
      "/policies/legal-notice",
      "/policies/privacy",
      "/policies/returns-and-refund",
      "/policies/shipping",
      "/policies/terms-of-service",
    ]),
  },
  {
    legend: "Other",
    options: toOptions(["/cart"]),
  },
];

const RevalidatePage = () => {
  if (process.env.ENABLE_REVALIDATE_CONSOLE !== "true") {
    notFound();
  }

  return <RevalidateConsole routeGroups={ROUTE_GROUPS} tagGroups={TAG_GROUPS} />;
};

export default RevalidatePage;
