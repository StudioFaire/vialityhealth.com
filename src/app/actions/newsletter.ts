"use server";

import { resend, isResendConfigured } from "@/lib/resend";

export async function subscribeToNewsletter(
  _prevState: { success: boolean; message: string },
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const email = formData.get("email") as string | null;

  if (!email || !email.includes("@")) {
    return { success: false, message: "Please enter a valid email address." };
  }

  if (!isResendConfigured() || !resend) {
    console.log("[newsletter] Resend not configured — email:", email);
    return { success: true, message: "Thanks for subscribing!" };
  }

  try {
    await resend.contacts.create({
      email,
      unsubscribed: false,
    });

    return { success: true, message: "Thanks for subscribing!" };
  } catch (err) {
    console.error("[newsletter] Resend error:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
