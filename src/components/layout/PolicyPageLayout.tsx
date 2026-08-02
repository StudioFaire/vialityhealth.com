import type { Metadata } from "next";

export function generatePolicyMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
  };
}

export function PolicyPageLayout({
  title,
  lastUpdated,
  bodyHtml,
  children,
}: {
  title: string;
  lastUpdated?: string;
  bodyHtml?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background pt-10 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4">
            {title}
          </h1>
          {lastUpdated && (
            <p className="text-foreground/50 text-sm">Last updated: {lastUpdated}</p>
          )}
        </div>

        {bodyHtml ? (
          <div
            className="prose prose-lg prose-primary max-w-none
              prose-headings:font-serif prose-headings:text-primary
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3
              prose-strong:text-foreground
              prose-a:text-primary prose-a:underline hover:prose-a:text-secondary
              prose-li:text-foreground/80
              max-w-none"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        ) : children ? (
          <div className="prose prose-lg prose-primary max-w-none">{children}</div>
        ) : (
          <div className="prose prose-lg prose-primary max-w-none">
            <p className="text-foreground/70 leading-relaxed">
              This policy is currently being updated. If you have any questions, please
              contact us at{" "}
              <a
                href="mailto:hello@vialityhealth.com"
                className="text-primary underline hover:text-secondary transition-colors"
              >
                hello@vialityhealth.com
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
