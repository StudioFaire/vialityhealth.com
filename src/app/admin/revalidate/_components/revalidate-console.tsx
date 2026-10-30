"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";

import { revalidateConsole, type RevalidateConsoleResult } from "../_actions/revalidate";

export interface ConsoleOption {
  value: string;
  label: string;
}

export interface ConsoleGroup {
  legend: string;
  options: ConsoleOption[];
}

interface RevalidateConsoleProps {
  tagGroups: ConsoleGroup[];
  routeGroups: ConsoleGroup[];
}

interface CheckboxGroupProps {
  legend: string;
  options: ConsoleOption[];
  selected: string[];
  onChange: (value: string[]) => void;
}

function CheckboxGroup({ legend, options, selected, onChange }: CheckboxGroupProps) {
  return (
    <fieldset className="rounded-xl border border-border bg-card p-4">
      <legend className="px-1 text-sm font-medium text-primary">{legend}</legend>
      <div className="flex flex-col gap-2.5">
        {options.map((option) => (
          <label key={option.value} className="flex cursor-pointer items-start gap-2.5 text-sm">
            <input
              type="checkbox"
              checked={selected.includes(option.value)}
              className="mt-0.5 size-4 shrink-0 cursor-pointer accent-primary"
              onChange={(event) =>
                onChange(
                  event.target.checked
                    ? [...selected, option.value]
                    : selected.filter((value) => value !== option.value),
                )
              }
            />
            <span className="font-mono text-xs break-all text-foreground/80">{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

const textareaClassName =
  "min-h-24 w-full rounded-md border border-input bg-card px-3 py-2 font-mono text-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20";

export function RevalidateConsole({ tagGroups, routeGroups }: RevalidateConsoleProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [customTags, setCustomTags] = useState("");
  const [paths, setPaths] = useState<string[]>([]);
  const [customPaths, setCustomPaths] = useState("");
  const [siteWide, setSiteWide] = useState(false);
  const [result, setResult] = useState<RevalidateConsoleResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const hasSelection =
    tags.length > 0 ||
    customTags.trim() !== "" ||
    siteWide ||
    paths.length > 0 ||
    customPaths.trim() !== "";

  const reset = () => {
    setTags([]);
    setCustomTags("");
    setPaths([]);
    setCustomPaths("");
    setSiteWide(false);
    setResult(null);
  };

  const run = () => {
    setResult(null);

    startTransition(async () => {
      setResult(
        await revalidateConsole({
          tags: [...tags, customTags],
          paths: [...paths, customPaths],
          siteWide,
        }),
      );
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-16">
      <header className="space-y-3">
        <h1 className="font-serif text-4xl text-primary md:text-5xl">Cache revalidation console</h1>
        <p className="max-w-2xl text-sm text-foreground/60">
          Invalidate cache tags and routes by hand. Tags are marked stale and revalidate in the
          background; routes are revalidated on the next visit. Every action is idempotent, so
          running it twice does no extra work.
        </p>
      </header>

      <section className="flex flex-col gap-5 border-t border-border pt-8">
        <h2 className="text-lg font-medium text-primary">Tags</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {tagGroups.map((group) => (
            <CheckboxGroup
              key={group.legend}
              legend={group.legend}
              options={group.options}
              selected={tags}
              onChange={setTags}
            />
          ))}
        </div>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-primary">Additional tags</span>
          <textarea
            autoComplete="off"
            className={textareaClassName}
            placeholder={
              "One per line or comma separated, e.g.\nshopify-products\nshopify-collections"
            }
            value={customTags}
            onChange={(event) => setCustomTags(event.target.value)}
          />
        </label>
      </section>

      <section className="flex flex-col gap-5 border-t border-border pt-8">
        <div className="space-y-1">
          <h2 className="text-lg font-medium text-primary">Routes</h2>
          <p className="text-sm text-foreground/60">
            Unprefixed paths fan out to every market. Prefix a path with a locale (for example{" "}
            <code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-xs">/uk/shop</code>)
            to target one market.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {routeGroups.map((group) => (
            <CheckboxGroup
              key={group.legend}
              legend={group.legend}
              options={group.options}
              selected={paths}
              onChange={setPaths}
            />
          ))}
        </div>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-primary">Additional paths</span>
          <textarea
            autoComplete="off"
            className={textareaClassName}
            placeholder={"One per line or comma separated, e.g.\n/shop\n/uk/product/example"}
            value={customPaths}
            onChange={(event) => setCustomPaths(event.target.value)}
          />
        </label>
        <label className="flex cursor-pointer items-start gap-2.5 rounded-md border border-border bg-card px-4 py-3 text-sm">
          <input
            type="checkbox"
            checked={siteWide}
            className="mt-0.5 size-4 shrink-0 cursor-pointer accent-primary"
            onChange={(event) => setSiteWide(event.target.checked)}
          />
          <span>Clear the whole site (layout) — ignores the routes above</span>
        </label>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <Button disabled={!hasSelection || isPending} onClick={run}>
          {isPending ? "Invalidating…" : "Invalidate"}
        </Button>
        <Button variant="outline" onClick={reset}>
          Reset
        </Button>
      </div>

      {result?.error !== undefined && (
        <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {result.error}
        </p>
      )}

      {result !== null && result.error === undefined && (
        <div
          role="status"
          className="flex flex-col gap-1 rounded-xl bg-green-500/10 px-4 py-3 text-sm text-green-700"
        >
          <p>
            Invalidated {result.tags.length} tag{result.tags.length === 1 ? "" : "s"} and{" "}
            {result.paths.length} path{result.paths.length === 1 ? "" : "s"}.
          </p>
          {result.tags.length > 0 && (
            <p className="font-mono text-xs break-all">{result.tags.join(", ")}</p>
          )}
          {result.paths.length > 0 && (
            <p className="font-mono text-xs break-all">{result.paths.join(", ")}</p>
          )}
        </div>
      )}
    </div>
  );
}
