"use client";

import { useActionState, useEffect, useState } from "react";
import { XIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { subscribeToNewsletter } from "@/app/actions/newsletter";

const VIP_COOKIE = "viality_vip_dismissed";
const AGE_COOKIE = "viality.age_verified";
const AGE_VERIFIED_EVENT = "viality:age-verified";
const SHOW_DELAY_MS = 30_000;

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${name}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export function VipPassDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [newsletterState, newsletterAction, newsletterPending] = useActionState(
    subscribeToNewsletter,
    { success: false, message: "" }
  );

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const schedule = () => {
      timeout = setTimeout(() => {
        if (!getCookie(VIP_COOKIE)) {
          setIsOpen(true);
        }
      }, SHOW_DELAY_MS);
    };

    const onAgeVerified = () => {
      window.removeEventListener(AGE_VERIFIED_EVENT, onAgeVerified);
      schedule();
    };

    if (!getCookie(VIP_COOKIE)) {
      if (getCookie(AGE_COOKIE)) {
        schedule();
      } else {
        window.addEventListener(AGE_VERIFIED_EVENT, onAgeVerified);
      }
    }

    return () => {
      if (timeout) clearTimeout(timeout);
      window.removeEventListener(AGE_VERIFIED_EVENT, onAgeVerified);
    };
  }, []);

  useEffect(() => {
    if (newsletterState.success) {
      setCookie(VIP_COOKIE, "true", 365);
      setIsOpen(false);
    }
  }, [newsletterState.success]);

  const dismiss = () => {
    setCookie(VIP_COOKIE, "true", 365);
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCookie(VIP_COOKIE, "true", 365);
    }
    setIsOpen(open);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="bg-primary text-primary-foreground border-primary/40 sm:max-w-md">
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 z-10 size-8 inline-flex items-center justify-center rounded-full text-primary-foreground/70 hover:bg-white/10 hover:text-primary-foreground transition-colors"
          aria-label="Close"
        >
          <XIcon className="size-4" />
        </button>
        <AlertDialogHeader className="items-center text-center gap-3">
          <AlertDialogTitle className="font-serif uppercase font-light text-3xl tracking-wide">
            Your VIP Pass
          </AlertDialogTitle>
          <AlertDialogDescription className="uppercase text-primary-foreground/65 text-sm tracking-widest">
            Subscribe for product updates and discount offers
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form action={newsletterAction} className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            name="email"
            autoComplete="email"
            aria-label="Email address"
            placeholder="YOUR EMAIL ADDRESS"
            className="flex-1 bg-transparent border-b border-primary-foreground/25 px-4 py-3 text-xs focus:outline-none focus:border-accent placeholder:text-primary-foreground/30 uppercase tracking-widest transition-colors disabled:opacity-50"
            required
            disabled={newsletterPending}
          />
          <button
            type="submit"
            disabled={newsletterPending}
            className="px-8 py-3 bg-accent text-accent-foreground text-xs uppercase tracking-widest hover:bg-accent/88 transition-colors disabled:opacity-50"
          >
            {newsletterPending ? "Sending..." : "Sign Up"}
          </button>
        </form>
        {newsletterState.message && (
          <p
            className={`text-xs uppercase tracking-widest ${newsletterState.success ? "text-accent" : "text-red-300"}`}
          >
            {newsletterState.message}
          </p>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
