"use client";

import { useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";

type FacetValue = {
  value: string;
  label: string;
  count: number;
  disabled: boolean;
};

export type Facet = {
  id: string;
  label: string;
  values: FacetValue[];
};

const MAX_VISIBLE = 8;

function FacetGroup({
  facet,
  selected,
  onToggle,
}: {
  facet: Facet;
  selected: Record<string, string[]>;
  onToggle: (facetId: string, value: string) => void;
}) {
  const [showAll, setShowAll] = useState(false);

  const selectedValues = new Set(selected[facet.id] ?? []);

  const hiddenSelected = facet.values.slice(MAX_VISIBLE).filter((v) => selectedValues.has(v.value));

  const visibleValues = showAll
    ? facet.values
    : [...facet.values.slice(0, MAX_VISIBLE), ...hiddenSelected];

  const hasMore = facet.values.length > MAX_VISIBLE;

  return (
    <div className="mb-6">
      <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/50 mb-3">
        {facet.label}
      </h4>
      <ul className="space-y-2.5">
        {visibleValues.map((value) => {
          const checked = selectedValues.has(value.value);
          return (
            <li key={value.value}>
              <label
                className={`flex items-center gap-2.5 text-sm cursor-pointer transition-opacity ${
                  value.disabled && !checked ? "opacity-40" : "group"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={value.disabled && !checked}
                  onChange={() => onToggle(facet.id, value.value)}
                  className="h-4 w-4 rounded border-border accent-primary cursor-pointer disabled:cursor-not-allowed"
                />
                <span className="flex-1 text-foreground/80 group-hover:text-foreground transition-colors">
                  {value.label}
                </span>
                <span className="text-xs text-foreground/40 tabular-nums">{value.count}</span>
              </label>
            </li>
          );
        })}
      </ul>
      {hasMore && (
        <button
          onClick={() => setShowAll((s) => !s)}
          className="mt-3 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-widest text-primary hover:text-primary/60 transition-colors"
        >
          {showAll ? "Show less" : `Show all (${facet.values.length})`}
          <ChevronDown
            size={12}
            className={`transition-transform ${showAll ? "rotate-180" : ""}`}
          />
        </button>
      )}
    </div>
  );
}

export function ProductFilters({
  facets,
  selected,
  onToggle,
  searchQuery,
  onSearchChange,
  onClearAll,
  activeCount,
}: {
  facets: Facet[];
  selected: Record<string, string[]>;
  onToggle: (facetId: string, value: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearAll: () => void;
  activeCount: number;
}) {
  return (
    <div>
      <div className="relative mb-6">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none"
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products..."
          aria-label="Search products"
          className="w-full bg-white border border-border/40 rounded-full pl-10 pr-9 py-2.5 text-sm placeholder:text-foreground/40 focus:outline-none focus:border-primary/50"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {activeCount > 0 && (
        <button
          onClick={onClearAll}
          className="mb-6 text-xs uppercase tracking-widest text-primary underline underline-offset-4 hover:text-primary/60 transition-colors"
        >
          Clear all ({activeCount})
        </button>
      )}

      {facets.map((facet) => (
        <FacetGroup key={facet.id} facet={facet} selected={selected} onToggle={onToggle} />
      ))}
    </div>
  );
}
