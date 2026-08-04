import { cn } from "@/lib/utils";
import { SocialIcon as SocialIconProvider } from "react-social-icons";

export function SocialIcon({
  className,
  style = {
    blockSize: "inherit",
    inlineSize: "auto",
  },
  url,
}: {
  className?: string;
  style?: React.CSSProperties;
  url: string;
}) {
  return (
    <SocialIconProvider
      className={cn(
        "icon [&_.social-svg]:fill-background-inverted! [&_.social-svg-mask]:fill-foreground-inverted! focus-visible:[&_.social-svg]:fill-accent! focus-visible:[&_.social-svg]:stroke-accent! focus-visible:[&_.social-svg-mask]:stroke-accent!",
        className,
      )}
      target="_blank"
      url={url}
      style={style}
    />
  );
}
