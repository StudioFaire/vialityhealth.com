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
  console.log("Follow Us Menu:", url); // Log the menu data for debugging
  return (
    <><span>AAAA</span>
      <SocialIconProvider
        className={cn(
          "icon [&_.social-svg-icon]:fill-background-inverted! [&_.social-svg-mask]:fill-foreground-inverted! focus-visible:[&_.social-svg-icon]:fill-accent! focus-visible:[&_.social-svg-icon]:stroke-accent! focus-visible:[&_.social-svg-mask]:stroke-accent!",
          className,
        )}
        target="_blank"
        url={url}
        style={style}
      /></>
  );
}
