import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

function InputGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      className={cn("group relative flex w-full items-center", className)}
      {...props}
    />
  );
}

function InputGroupAddon({
  className,
  align = "inline-end",
  ...props
}: ComponentProps<"div"> & { align?: "inline-start" | "inline-end" }) {
  return (
    <div
      data-slot="input-group-addon"
      data-align={align}
      className={cn(
        "flex shrink-0 items-center text-primary/50 select-none",
        align === "inline-start" ? "order-first mr-2" : "order-last ml-2",
        className,
      )}
      {...props}
    />
  );
}

function InputGroupInput({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      data-slot="input-group-control"
      className={cn(
        "w-full min-w-0 flex-1 bg-transparent py-3 focus:outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { InputGroup, InputGroupAddon, InputGroupInput };
