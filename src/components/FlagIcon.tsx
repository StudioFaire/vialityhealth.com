import { AU, GB } from "country-flag-icons/react/3x2";

const FLAGS = { AU, GB } as const;

type FlagCode = keyof typeof FLAGS;

export function FlagIcon({
  countryCode,
  className,
  title,
}: {
  countryCode: string;
  className?: string;
  title?: string;
}) {
  const Flag = FLAGS[countryCode as FlagCode];
  if (!Flag) return null;
  return <Flag className={className} title={title} />;
}
