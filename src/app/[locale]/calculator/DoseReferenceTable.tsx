"use client";

import { m } from "motion/react";
import { cn } from "@/lib/utils";
import {
  formatDose,
  formatNumber,
  type DeliveryMode,
  type DoseTableRow,
  type DoseUnit,
} from "@/lib/calculator";

export function DoseReferenceTable({
  rows,
  mode,
  doseUnit,
  currentDoseMcg,
  maxClicks,
  vialMg,
  waterMl,
}: {
  rows: DoseTableRow[];
  mode: DeliveryMode;
  doseUnit: DoseUnit;
  currentDoseMcg: number;
  maxClicks: number;
  vialMg: number;
  waterMl: number;
}) {
  const hasOutsideRow = rows.some((row) =>
    mode === "pen" ? row.clicks > maxClicks : row.unitsExact > 100,
  );

  return (
    <m.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7 }}
      className="mt-16 overflow-hidden rounded-3xl border border-border/60 bg-card"
    >
      <div className="p-6 md:p-8">
        <h2 className="font-serif text-2xl font-light text-primary">Common doses for this mix</h2>
        <p className="mt-2 text-sm font-light leading-relaxed text-primary/55">
          {formatNumber(vialMg, 2)} mg in {formatNumber(waterMl, 2)} mL. The doses below are
          converted at this concentration.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-80 text-sm">
          <thead className="border-y border-border/60 bg-surface-section/60 text-left text-[10px] uppercase tracking-widest text-primary/50">
            <tr>
              <th className="px-6 py-3 font-medium md:px-8">Dose</th>
              <th className="px-6 py-3 text-right font-medium md:px-8">
                {mode === "pen" ? "Pen (clicks)" : "Syringe (units)"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {rows.map((row) => {
              const current = Math.abs(row.doseMcg - currentDoseMcg) < 1e-9;
              const outside = mode === "pen" ? row.clicks > maxClicks : row.unitsExact > 100;
              return (
                <tr key={row.dose} className={current ? "bg-accent/20" : undefined}>
                  <td className="px-6 py-3 text-primary/70 md:px-8">
                    {formatDose(row.doseMcg, doseUnit)}
                    {current && (
                      <span className="ml-2 text-[10px] uppercase tracking-widest text-primary/40">
                        your dose
                      </span>
                    )}
                  </td>
                  <td
                    className={cn(
                      "px-6 py-3 text-right tabular-nums md:px-8",
                      outside ? "text-destructive" : "text-primary",
                    )}
                  >
                    {mode === "pen" ? row.clicks : formatNumber(row.unitsExact, 1)}
                    {outside && " †"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {hasOutsideRow && (
        <p className="border-t border-border/60 px-6 py-4 text-[11px] font-light leading-relaxed text-primary/40 md:px-8">
          † More than a single U-100 syringe or pen dial holds. Reduce the water or split the dose
          as appropriate for your equipment.
        </p>
      )}
    </m.div>
  );
}
