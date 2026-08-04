import { cn } from "@/lib/utils";

import { SocialIcon } from "./SocialIcon";

export const SocialMenu = ({
  className,
  iconClassName,
  urls,
}: {
  className?: string;
  iconClassName?: string;
  urls: string[];
}) => {
  return (
    <nav
      className={cn("min-h-8 grid grid-flow-col content-center justify-center gap-4", className)}
    >
      {urls.map((url) => (
        <SocialIcon key={url} className={cn("group aspect-square", iconClassName)} url={url} />
      ))}
    </nav>
  );
};
