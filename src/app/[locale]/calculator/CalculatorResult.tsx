"use client";

import { cn } from "@/lib/utils";
import {
  formatDose,
  formatNumber,
  formatStrength,
  type DoseCalculation,
  type DoseUnit,
} from "@/lib/calculator";

const SYRINGE_LABEL_TICKS = [0, 20, 40, 60, 80, 100];
const SYRINGE_TICKS = Array.from({ length: 21 }, (_, index) => index * 5);

export function CalculatorResult({
  result,
  locked = false,
  doseUnit,
  onUseSuggestion,
}: {
  result: DoseCalculation | null;
  locked?: boolean;
  doseUnit: DoseUnit;
  onUseSuggestion: (waterMl: number) => void;
}) {
  const strength = result ? formatStrength(result.concentrationMcgPerMl) : null;
  const injections = result
    ? result.mode === "pen"
      ? result.dosesPerCartridge
      : result.dosesPerVial
    : 0;

  return (
    <aside className="min-w-0">
      <div className="rounded-3xl bg-surface-section p-6 md:p-7 lg:sticky lg:top-24">
        <p className="text-xs uppercase tracking-widest text-primary/45">Your result</p>

        {locked ? (
          <div className="mt-6 rounded-2xl border border-border/60 bg-background/50 px-5 py-8">
            <p className="text-sm font-light leading-relaxed text-primary/55">
              Confirm the research-use statement above to unlock the calculator.
            </p>
          </div>
        ) : !result ? (
          <div className="mt-6 rounded-2xl border border-border/60 bg-background/50 px-5 py-8">
            <p className="text-sm font-light leading-relaxed text-primary/55">
              Fill in your vial, water and dose and the draw appears here.
            </p>
          </div>
        ) : (
          <div aria-live="polite">
            <div
              className={cn(
                "mt-4 rounded-2xl px-5 py-6",
                result.tooSmall
                  ? "border border-destructive/30 bg-destructive/10 text-destructive"
                  : "bg-primary text-primary-foreground",
              )}
            >
              <p className="text-[10px] uppercase tracking-widest opacity-60">
                {result.mode === "pen" ? "Dial to" : "Draw to"}
              </p>
              <div className="mt-1 flex items-end gap-2">
                <span className="font-serif text-6xl leading-none">
                  {result.mode === "pen" ? result.clicks : formatNumber(result.unitsRounded, 1)}
                </span>
                <span className="pb-2 text-xs uppercase tracking-widest opacity-70">
                  {result.mode === "pen" ? (result.clicks === 1 ? "click" : "clicks") : "units"}
                </span>
              </div>
              <p className="mt-2 text-sm opacity-70">
                {formatNumber(
                  result.mode === "pen" ? result.dialUnits / 100 : result.unitsExact / 100,
                  3,
                )}{" "}
                mL
              </p>
            </div>

            <ResultNotices result={result} doseUnit={doseUnit} onUseSuggestion={onUseSuggestion} />

            <dl className="mt-5 divide-y divide-border/60 border-y border-border/60 text-sm">
              <StatRow
                label="Strength"
                value={strength ? `${strength.value} ${strength.unit}` : "—"}
              />
              <StatRow
                label={result.mode === "pen" ? "Injections per cartridge" : "Injections per vial"}
                value={injections > 0 ? formatNumber(injections, 0) : "—"}
              />
              {result.mode === "pen" && !result.tooSmall && !result.overMax && (
                <StatRow
                  label="Each dose delivers"
                  value={formatDose(result.actualMcg, doseUnit)}
                />
              )}
              {result.daysToFinish !== null && (
                <StatRow
                  label="One mix lasts about"
                  value={`${Math.round(result.daysToFinish)} days`}
                />
              )}
            </dl>

            <div className="mt-6">
              {result.mode === "pen" ? (
                result.clicks >= 1 && (
                  <PenDial
                    clicks={result.clicks}
                    maxClicks={result.maxClicks}
                    dialUnits={result.dialUnits}
                  />
                )
              ) : (
                <SyringeScale units={result.unitsExact} over={result.overSyringe} />
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3">
      <dt className="text-primary/55">{label}</dt>
      <dd className="text-right tabular-nums text-primary">{value}</dd>
    </div>
  );
}

type NoticeTone = "bad" | "warn" | "info" | "good";
type Notice = { tone: NoticeTone; title: string; body: string };

function buildNotices(result: DoseCalculation, doseUnit: DoseUnit): Notice[] {
  const notices: Notice[] = [];

  if (result.overSyringe) {
    notices.push({
      tone: "bad",
      title: "Draw exceeds a 1 mL syringe",
      body: `This works out at ${formatNumber(result.unitsExact, 1)} units, but a U-100 barrel only goes to 100. Use no more than ${formatNumber(result.waterForFullSyringe, 2)} mL of water for this dose, or split the draw between syringes.`,
    });
  }

  if (result.tooSmall) {
    notices.push({
      tone: "bad",
      title: "Dose is below one click",
      body: `Each click carries about ${formatDose(result.mcgPerClick, doseUnit)} at this concentration, which is more than the entire dose. More water would make every click smaller.`,
    });
  } else if (result.overMax) {
    notices.push({
      tone: "bad",
      title: "Dose exceeds the pen dial",
      body: `This needs ${result.clicks} clicks, but the pen stops at ${formatNumber(result.maxClicks, 0)}. Mixing with no more than ${formatNumber(result.waterForMaxClicks, 2)} mL of water would bring it inside the dial.`,
    });
  } else if (result.mode === "pen") {
    const drift = Math.abs(result.driftPct);
    if (drift <= 0.5) {
      notices.push({
        tone: "good",
        title: "Lands on your dose",
        body: `${result.clicks} ${result.clicks === 1 ? "click" : "clicks"} delivers ${formatDose(result.actualMcg, doseUnit)}, within a fraction of a percent of the target.`,
      });
    } else {
      notices.push({
        tone: drift > 2 ? "warn" : "info",
        title:
          drift > 2
            ? `Slightly ${result.driftPct > 0 ? "over" : "under"} target`
            : "Close to your dose",
        body: `${result.clicks} ${result.clicks === 1 ? "click" : "clicks"} delivers ${formatDose(result.actualMcg, doseUnit)} — about ${formatNumber(drift, 1)}% ${result.driftPct > 0 ? "above" : "below"} the ${formatDose(result.doseMcg, doseUnit)} target. A pen can only dial whole clicks, so the nearest click is the closest available.`,
      });
    }
  } else {
    const drift = Math.abs(result.unitsRounded - result.unitsExact);
    notices.push({
      tone: drift < 0.05 ? "good" : "info",
      title: drift < 0.05 ? "Lands on your dose" : "Nearest barrel mark",
      body:
        drift < 0.05
          ? `${formatNumber(result.unitsRounded, 1)} units delivers ${formatDose(result.doseMcg, doseUnit)}.`
          : `The exact draw is ${formatNumber(result.unitsExact, 2)} units, which reads as ${formatNumber(result.unitsRounded, 1)} units on the barrel.`,
    });
  }

  if (result.overfill) {
    notices.push({
      tone: "warn",
      title: "Mix is larger than the cartridge",
      body: `The mix comes to ${formatNumber(result.waterMl, 2)} mL, while the cartridge holds ${formatNumber(result.cartridgeMl, 2)} mL. Concentration is unchanged, but the cartridge will be used up before the rest of the vial.`,
    });
  }

  if (result.outlastsWindow && result.daysToFinish !== null) {
    notices.push({
      tone: "info",
      title: "This mix outlasts the storage window",
      body: `On this schedule, your last dose would fall around day ${Math.round(result.daysToFinish)}. Since most mixes are kept for about four weeks, a smaller vial or mixing only part of a vial may be a better fit.`,
    });
  }

  return notices;
}

function ResultNotices({
  result,
  doseUnit,
  onUseSuggestion,
}: {
  result: DoseCalculation;
  doseUnit: DoseUnit;
  onUseSuggestion: (waterMl: number) => void;
}) {
  const notices = buildNotices(result, doseUnit);

  if (notices.length === 0) return null;

  return (
    <div className="mt-4 space-y-3">
      {notices.map((notice) => (
        <div
          key={notice.title}
          className={cn(
            "rounded-2xl border px-4 py-3",
            notice.tone === "bad" && "border-destructive/30 bg-destructive/5 text-destructive",
            notice.tone === "warn" && "border-accent bg-accent/20 text-primary",
            notice.tone === "info" && "border-border/60 bg-background/60 text-primary",
            notice.tone === "good" && "border-border/60 bg-background/60 text-primary",
          )}
        >
          <p className="text-xs font-medium uppercase tracking-widest">{notice.title}</p>
          <p className="mt-1.5 text-xs font-light leading-[1.75] opacity-80">{notice.body}</p>
          {result.suggestion && notice.tone !== "good" && notice.tone !== "bad" && (
            <button
              type="button"
              onClick={() => onUseSuggestion(result.suggestion!.waterMl)}
              className="mt-2 cursor-pointer text-xs font-medium underline underline-offset-4 transition-opacity hover:opacity-60"
            >
              Switch to {formatNumber(result.suggestion.waterMl, 3)} mL
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function SyringeScale({ units, over }: { units: number; over: boolean }) {
  const clamped = Math.min(Math.max(units, 0), 100);
  const start = 22;
  const width = 272;
  const x = start + (clamped / 100) * width;

  return (
    <figure>
      <svg
        viewBox="0 0 320 78"
        width="100%"
        role="img"
        aria-label={
          over
            ? `${formatNumber(units, 1)} units is more than a 1 mL syringe holds`
            : `Syringe barrel with the plunger drawn back to ${formatNumber(units, 1)} units`
        }
        className="block h-auto w-full"
      >
        <line x1="0" y1="38" x2="20" y2="38" className="stroke-primary/30" strokeWidth="1.5" />
        <rect
          x="20"
          y="26"
          width="276"
          height="24"
          rx="6"
          className="fill-background stroke-border"
          strokeWidth="1"
        />
        {clamped > 0 && (
          <rect
            x="21"
            y="27"
            width={Math.max(x - 22, 0)}
            height="22"
            rx="5"
            className={over ? "fill-destructive/25" : "fill-primary/20"}
          />
        )}
        <rect
          x={x - 2}
          y="27"
          width="4"
          height="22"
          rx="1"
          className={over ? "fill-destructive" : "fill-primary"}
        />
        <line x1={x + 2} y1="38" x2="306" y2="38" className="stroke-primary/40" strokeWidth="3" />
        <rect x="306" y="20" width="6" height="36" rx="1" className="fill-primary/60" />
        {SYRINGE_TICKS.map((tick) => {
          const tickX = start + (tick / 100) * width;
          const major = tick % 10 === 0;
          return (
            <line
              key={tick}
              x1={tickX}
              y1="50"
              x2={tickX}
              y2={major ? 57 : 54}
              className="stroke-primary/25"
              strokeWidth="1"
            />
          );
        })}
        {SYRINGE_LABEL_TICKS.map((tick) => {
          const tickX = start + (tick / 100) * width;
          return (
            <text
              key={tick}
              x={tickX}
              y="70"
              textAnchor="middle"
              fontSize="8"
              className="fill-primary/40"
            >
              {tick}
            </text>
          );
        })}
      </svg>
      <figcaption className="mt-3 text-[11px] font-light leading-relaxed text-primary/45">
        The scale is for a U-100 syringe. A U-30 or U-50 barrel uses the same mark when the draw
        fits within its smaller capacity. On a U-300 syringe, the equivalent draw is{" "}
        <span className="tabular-nums text-primary/65">{formatNumber(units * 3, 1)}</span> units.
      </figcaption>
    </figure>
  );
}

function PenDial({
  clicks,
  maxClicks,
  dialUnits,
}: {
  clicks: number;
  maxClicks: number;
  dialUnits: number;
}) {
  const progress = Math.min(100, (clicks / maxClicks) * 100);
  const values = [-2, -1, 0, 1, 2]
    .map((offset) => ({ offset, value: clicks + offset }))
    .filter(({ value }) => value >= 0);

  return (
    <figure>
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-background/70 px-4 pb-4 pt-5">
        <div className="flex items-center justify-center gap-3 sm:gap-5">
          {values.map(({ offset, value }) => (
            <span
              key={offset}
              aria-hidden={offset !== 0}
              className={cn(
                "min-w-10 text-center font-serif",
                offset === 0
                  ? "rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-2xl text-primary"
                  : "text-sm text-primary/20",
              )}
            >
              {value}
            </span>
          ))}
        </div>
        <div className="mx-auto mt-2 size-0 border-x-[5px] border-t-[6px] border-x-transparent border-t-primary" />
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div
            className={cn(
              "h-full rounded-full",
              clicks > maxClicks ? "bg-destructive" : "bg-primary",
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <figcaption className="mt-3 text-[11px] font-light leading-relaxed text-primary/45">
        Set the dial window to <span className="font-medium text-primary/65">{clicks}</span> (
        <span className="tabular-nums text-primary/65">{formatNumber(dialUnits / 100, 2)}</span>{" "}
        mL). The pen can only land on a whole click, so this is the nearest available dose.
      </figcaption>
    </figure>
  );
}
