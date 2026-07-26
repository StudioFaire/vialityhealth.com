"use client";

import { useState } from "react";
import Link from "next/link";
import { MoveRight, Check } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link
            href="/"
            className="font-serif uppercase tracking-widest block mb-6 transition-opacity hover:opacity-60"
            style={{ fontSize: "1.45rem" }}
          >
            viality
          </Link>
          <p className="text-primary-foreground/70 max-w-sm font-light leading-relaxed">
            Wellness, refined. Research grade peptides. Every detail disclosed,
            every claim supported by evidence.
          </p>
        </div>

        <section className="grid grid-cols-2 gap-12">
          <div>
            <h4 className="uppercase tracking-widest text-xs font-semibold mb-6">
              Explore
            </h4>
            <ul className="space-y-4 text-sm text-primary-foreground/70">
              <li>
                <Link href="/about" className="hover:text-accent transition-colors">
                  Our Philosophy
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-accent transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/lab-reports" className="hover:text-accent transition-colors">
                  Lab Reports
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-accent transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="uppercase tracking-widest text-xs font-semibold mb-6">
              Connect
            </h4>
            <ul className="space-y-4 text-sm text-primary-foreground/70">
              <li>
                <Link href="/contact" className="hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </section>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/50">
        <p>&copy; {new Date().getFullYear()} viality. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary-foreground transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-primary-foreground transition-colors">
            Terms
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 text-xs text-primary-foreground/30 text-center tracking-widest leading-relaxed">
        <p>
          These statements have not been evaluated by the Food and Drug
          Administration.
        </p>
        <p>
          This product is intended strictly for research and laboratory use and
          is not for human consumption.
        </p>
        <p className="mt-2">
          By completing your purchase, you confirm that you are at least 18 years
          of age, that this material will be handled responsibly, and that it
          will be used solely for lawful research or analytical purposes in
          accordance with all applicable regulations.
        </p>
      </div>
    </footer>
  );
}
