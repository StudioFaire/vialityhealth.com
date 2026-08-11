"use client";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AGE_VERIFIED_COOKIE = "viality.age_verified";

function isAgeVerified(): boolean {
  return document.cookie
    .split(";")
    .some((cookie) => cookie.trim() === `${AGE_VERIFIED_COOKIE}=true`);
}

export function AgeVerification() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isAgeVerified()) {
      setIsOpen(true);
    }
  }, []);

  const confirmAge = () => {
    document.cookie = `${AGE_VERIFIED_COOKIE}=true; path=/; max-age=31536000; SameSite=Lax`;
    window.dispatchEvent(new Event("viality:age-verified"));
    setIsOpen(false);
  };

  const denyAge = () => {
    const referrer = document.referrer;
    let destination = "https://www.google.com";
    if (referrer) {
      try {
        const referrerUrl = new URL(referrer);
        if (referrerUrl.origin !== window.location.origin) {
          destination = referrer;
        }
      } catch {
        // ignore malformed referrer
      }
    }
    window.location.href = destination;
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (open) setIsOpen(true);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-serif text-primary">
            Are you 18 or older?
          </AlertDialogTitle>
          <AlertDialogDescription>
            You must be of legal age to enter this site. Please confirm your
            age to continue.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={denyAge}>
            No, I&apos;m under 18
          </AlertDialogCancel>
          <AlertDialogAction onClick={confirmAge}>
            Yes, I&apos;m 18+
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
