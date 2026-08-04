"use client";

import { useActionState } from "react";
import Link from "next/link";
import { MoveRight, Check } from "lucide-react";
import { subscribeToNewsletter } from "@/app/actions/newsletter";
import { SocialMenu } from "@/components/SocialMenu";
import { getMenu } from "@/lib/shopify";

export async function Footer() {
  const [state, formAction, isPending] = useActionState(subscribeToNewsletter, {
    success: false,
    message: "",
  });

  const followUsMenu = await getMenu("follow-us-viality");

  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="font-serif text-4xl mb-4 inline-block"
            >
              Viality
            </Link>
            <p className="text-primary-foreground/80 max-w-sm text-sm leading-relaxed mb-6">
              We operate with complete openness. Every claim we make is verifiable. Every detail disclosed, every claim supported by evidence.
            </p>
            {followUsMenu && (
              <SocialMenu
                className="flex items-center space-x-4"
                urls={followUsMenu.items?.map((item) => item.url ?? "").filter(Boolean) ?? []}
              />
            )}
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2">
            <h4 className="font-medium text-sm tracking-widest uppercase mb-6 opacity-70">
              Shop
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/shop"
                  className="hover:opacity-70 transition-opacity"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=Capsules"
                  className="hover:opacity-70 transition-opacity"
                >
                  Capsules
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=Gel"
                  className="hover:opacity-70 transition-opacity"
                >
                  Sea Moss Gel
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=Bundles"
                  className="hover:opacity-70 transition-opacity"
                >
                  Bundles
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-medium text-sm tracking-widest uppercase mb-6 opacity-70">
              Company
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:opacity-70 transition-opacity"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/about#sourcing"
                  className="hover:opacity-70 transition-opacity"
                >
                  Sourcing
                </Link>
              </li>
              <li>
                <Link
                  href="/about#quality"
                  className="hover:opacity-70 transition-opacity"
                >
                  Quality & Testing
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:opacity-70 transition-opacity"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies Column */}
          <div className="lg:col-span-2">
            <h4 className="font-medium text-sm tracking-widest uppercase mb-6 opacity-70">
              Policies
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  href="/policies/returns-and-refund"
                  className="hover:opacity-70 transition-opacity"
                >
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/shipping"
                  className="hover:opacity-70 transition-opacity"
                >
                  Shipping
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/privacy"
                  className="hover:opacity-70 transition-opacity"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/terms-of-service"
                  className="hover:opacity-70 transition-opacity"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/cancellation-policy"
                  className="hover:opacity-70 transition-opacity"
                >
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/legal-notice"
                  className="hover:opacity-70 transition-opacity"
                >
                  Legal Notice
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/contact-information"
                  className="hover:opacity-70 transition-opacity"
                >
                  Contact Info
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-2">
            <h4 className="font-medium text-sm tracking-widest uppercase mb-6 opacity-70">
              Newsletter
            </h4>
            <p className="text-primary-foreground/80 text-sm mb-4">
              Wellness insights, new arrivals and offers, directly to your
              inbox.
            </p>
            <form action={formAction} className="relative">
              <input
                type="email"
                name="email"
                placeholder="Email address"
                required
                className="w-full bg-transparent border-b border-primary-foreground/30 py-3 pr-12 focus:outline-none focus:border-primary-foreground transition-colors text-sm placeholder:text-primary-foreground/50"
              />
              <button
                type="submit"
                disabled={isPending}
                className="absolute right-0 top-0 bottom-0 px-2 flex items-center hover:opacity-70 transition-opacity disabled:opacity-50"
                aria-label="Subscribe"
              >
                {state.success && state.message ? (
                  <Check size={20} className="text-accent" />
                ) : (
                  <MoveRight size={20} />
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/60">
          <div>
            &copy; {new Date().getFullYear()} Viality |{" "}
            <Link href="/policies/privacy" className="hover:underline">
              Privacy
            </Link>{" "}
            &middot;{" "}
            <Link href="/policies/terms-of-service" className="hover:underline">
              Terms
            </Link>{" "}
            &middot;{" "}
            <Link href="/policies/shipping" className="hover:underline">
              Shipping
            </Link>{" "}
            &middot;{" "}
            <Link href="/policies/returns-and-refund" className="hover:underline">
              Returns
            </Link>{" "}
            &middot;{" "}
            <Link href="/policies/cancellation-policy" className="hover:underline">
              Cancellation
            </Link>{" "}
            &middot;{" "}
            <Link href="/policies/legal-notice" className="hover:underline">
              Legal
            </Link>
          </div>
          <div className="text-center md:text-right max-w-lg italic opacity-70">
            *This product is not intended to diagnose, treat, cure or prevent
            any disease.
          </div>
        </div>
      </div>
    </footer>
  );
}
