"use client";

import { useActionState } from "react";
import Link from "next/link";
import { subscribeToNewsletter } from "@/app/actions/newsletter";
import { SocialMenu } from "@/components/SocialMenu";

export function Footer({ followUsUrls = [] }: { followUsUrls?: string[] }) {
  const [state, formAction, isPending] = useActionState(subscribeToNewsletter, {
    success: false,
    message: "",
  });

  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-6">
            <Link
              href="/"
              className="font-serif text-4xl mb-4 inline-block"
            >
              Viality
            </Link>
            <p className="text-primary-foreground/80 max-w-sm text-sm leading-relaxed mb-6">
              We operate with complete openness. Every claim we make is verifiable. Every detail disclosed, every claim supported by evidence.
            </p>

            <br />

            {followUsUrls.length > 0 && (
              <SocialMenu
                className="flex items-center justify-start space-x-4"
                iconClassName="size-6!"
                urls={followUsUrls}
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

        </div>

        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/60">
          <span>&copy; {new Date().getFullYear()} Viality.  All rights reserved.</span>
          <div>
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
        </div>
        <div className="max-w-7xl mx-auto mt-12 text-xs text-primary-foreground/30 text-center tracking-widest leading-relaxed">
          <p>These statements have not been evaluated by the Food and Drug Administration. This product is intended strictly for research and laboratory use and is not for human consumption. By completing your purchase, you confirm that you are at least 18 years of age, that this material will be handled responsibly, and that it will be used solely for lawful research or analytical purposes in accordance with all applicable regulations.</p>
        </div>
      </div>
    </footer>
  );
}
