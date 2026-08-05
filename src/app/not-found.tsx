import Link from "next/link";
import { Reveal } from "@/components/Reveal";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <Reveal y={24}>
        <h1 className="text-4xl font-serif text-primary mb-4">Page Not Found</h1>
        <p className="text-foreground/60 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/shop"
          className="px-8 py-3 bg-primary text-white rounded-full font-medium tracking-wide uppercase text-sm"
        >
          Return to Shop
        </Link>
      </Reveal>
    </div>
  );
}
