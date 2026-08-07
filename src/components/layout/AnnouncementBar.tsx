export function AnnouncementBar({
  text,
}: {
  text?: string;
}) {
  return (
    <div className="bg-primary text-primary-foreground overflow-hidden py-2">
      <div className="flex whitespace-nowrap animate-marquee-banner">
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className="text-xs tracking-widest uppercase mx-8 flex items-center gap-3"
          >
            {text}
            <span className="text-primary-foreground/30">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
