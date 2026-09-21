"use client";

import { useEffect } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import { getLocaleFromPath, localizeHref, DEFAULT_LOCALE } from "@/lib/markets";

const KLAVIYO_ID = process.env.NEXT_PUBLIC_KLAVIYO_ID;

type ConsentValue = "granted" | "denied";
type ConsentSignals = Record<string, ConsentValue>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    klaviyo?: unknown[];
    __CookieConsent?: typeof CookieConsent;
  }
}

function pushConsentUpdate(signals: ConsentSignals) {
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", signals);
  } else {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(["consent", "update", signals]);
  }
}

function getConsentSignals(): ConsentSignals {
  const analytics = CookieConsent.acceptedCategory("analytics") ? "granted" : "denied";
  const marketing = CookieConsent.acceptedCategory("marketing") ? "granted" : "denied";

  return {
    analytics_storage: analytics,
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: marketing,
    personalization_storage: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
  };
}

function updateConsent() {
  pushConsentUpdate(getConsentSignals());
}

function loadKlaviyoIfGranted() {
  if (!KLAVIYO_ID || !CookieConsent.acceptedCategory("marketing")) return;
  if (document.querySelector('script[src*="static.klaviyo.com/onsite/js"]')) {
    return;
  }
  window.klaviyo = window.klaviyo || [];
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.async = true;
  script.src = `https://static.klaviyo.com/onsite/js/${KLAVIYO_ID}/klaviyo.js`;
  document.head.appendChild(script);
}

export function CookieConsentManager() {
  useEffect(() => {
    const locale = getLocaleFromPath(window.location.pathname) ?? DEFAULT_LOCALE;
    const privacyUrl = localizeHref("/policies/privacy", locale);
    const termsUrl = localizeHref("/policies/terms-of-service", locale);

    try {
      CookieConsent.run({
        cookie: {
          name: "cc_cookie",
          expiresAfterDays: 365,
        },
        categories: {
          necessary: {
            enabled: true,
            readOnly: true,
          },
          analytics: {
            autoClear: {
              cookies: [{ name: /^(_ga|_gid|_gat)/ }],
            },
          },
          marketing: {
            autoClear: {
              cookies: [{ name: /^__kla/ }, { name: "_kx" }],
            },
          },
        },
        guiOptions: {
          consentModal: {
            layout: "cloud inline",
            position: "bottom center",
            equalWeightButtons: true,
            flipButtons: false,
          },
          preferencesModal: {
            layout: "box",
            equalWeightButtons: true,
            flipButtons: false,
          },
        },
        onFirstConsent: () => {
          updateConsent();
          loadKlaviyoIfGranted();
        },
        onConsent: () => {
          updateConsent();
          loadKlaviyoIfGranted();
        },
        onChange: () => {
          updateConsent();
          loadKlaviyoIfGranted();
        },
        language: {
          default: "en",
          translations: {
            en: {
              consentModal: {
                title: "We use cookies",
                description:
                  "We use cookies to keep the site and your cart working, understand how it's used, and — with your permission — send you relevant offers. You can update your choices anytime.",
                acceptAllBtn: "Accept all",
                acceptNecessaryBtn: "Reject all",
                showPreferencesBtn: "Manage preferences",
                footer: `<a href="${privacyUrl}">Privacy policy</a> · <a href="${termsUrl}">Terms of service</a>`,
              },
              preferencesModal: {
                title: "Cookie preferences",
                acceptAllBtn: "Accept all",
                acceptNecessaryBtn: "Reject all",
                savePreferencesBtn: "Save preferences",
                closeIconLabel: "Close",
                serviceCounterLabel: "Service(s)",
                sections: [
                  {
                    title: "Your cookie preferences",
                    description:
                      "We use cookies to make this site work, understand how visitors use it, and show you relevant offers. Choose which categories you're happy to accept.",
                  },
                  {
                    title: "Strictly necessary",
                    description:
                      "These cookies are required for the site to function — including your Shopify cart and checkout. They can't be turned off.",
                    linkedCategory: "necessary",
                    cookieTable: {
                      caption: "Necessary cookies",
                      headers: {
                        name: "Name",
                        description: "Description",
                        duration: "Duration",
                      },
                      body: [
                        {
                          name: "cc_cookie",
                          description: "Stores your cookie consent choices.",
                          duration: "1 year",
                        },
                        {
                          name: "viality.age_verified",
                          description: "Remembers your age verification.",
                          duration: "1 year",
                        },
                        {
                          name: "Shopify cart",
                          description: "Keeps track of your cart between pages.",
                          duration: "Session",
                        },
                      ],
                    },
                  },
                  {
                    title: "Analytics",
                    description:
                      "These cookies help us understand how visitors use the site. They are set by Google Analytics.",
                    linkedCategory: "analytics",
                    cookieTable: {
                      caption: "Analytics cookies",
                      headers: {
                        name: "Name",
                        description: "Description",
                        duration: "Duration",
                      },
                      body: [
                        {
                          name: "_ga",
                          description: "Distinguishes unique visitors.",
                          duration: "2 years",
                        },
                        {
                          name: "_ga_<id>",
                          description: "Persists session state.",
                          duration: "2 years",
                        },
                      ],
                    },
                  },
                  {
                    title: "Marketing",
                    description:
                      "These cookies are used by Klaviyo to send personalised offers and measure the performance of our marketing.",
                    linkedCategory: "marketing",
                    cookieTable: {
                      caption: "Marketing cookies",
                      headers: {
                        name: "Name",
                        description: "Description",
                        duration: "Duration",
                      },
                      body: [
                        {
                          name: "__kla_id",
                          description: "Identifies returning visitors for Klaviyo tracking.",
                          duration: "2 years",
                        },
                        {
                          name: "_kx",
                          description: "Tracks anonymous browsing activity for Klaviyo.",
                          duration: "2 years",
                        },
                      ],
                    },
                  },
                  {
                    title: "More information",
                    description: `For full details, read our <a href="${privacyUrl}">privacy policy</a> and <a href="${termsUrl}">terms of service</a>.`,
                  },
                ],
              },
            },
          },
        },
      });
      window.__CookieConsent = CookieConsent;
    } catch (error) {
      console.error("[CookieConsent] failed to initialise", error);
    }
  }, []);

  return null;
}
