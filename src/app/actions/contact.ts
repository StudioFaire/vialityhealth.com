"use server";

import { resend, isResendConfigured } from "@/lib/resend";

export async function sendContactMessage(
  _prevState: { success: boolean; message: string },
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const name = formData.get("name") as string | null;
  const email = formData.get("email") as string | null;
  const phone = formData.get("phone") as string | null;
  const orderNumber = formData.get("orderNumber") as string | null;
  const subject = formData.get("subject") as string | null;
  const message = formData.get("message") as string | null;

  if (!name || !email || !subject || !message) {
    return { success: false, message: "Please fill in all required fields." };
  }

  if (!email.includes("@")) {
    return { success: false, message: "Please enter a valid email address." };
  }

  if (!isResendConfigured() || !resend) {
    console.log("[contact] Resend not configured — from:", email, "subject:", subject);
    return {
      success: true,
      message: "Thanks for reaching out. We'll get back to you within 24-48 business hours.",
    };
  }

  try {
    const html = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
      ${orderNumber ? `<p><strong>Order Number:</strong> ${orderNumber}</p>` : ""}
      <p><strong>Subject:</strong> ${subject}</p>
      <hr />
      <p>${message.replace(/\n/g, "<br />")}</p>
    `;

    await resend.emails.send({
      from: "Viality Health <noreply@updates.vialityhealth.com>",
      to: "vialityhealth@gmail.com",
      replyTo: email,
      subject: `[Contact] ${subject} — ${name}`,
      html,
    });

    return {
      success: true,
      message: "Thanks for reaching out. We'll get back to you within 24-48 business hours.",
    };
  } catch (err) {
    console.error("[contact] Resend error:", err);
    return {
      success: false,
      message: "Something went wrong. Please try again or email us directly.",
    };
  }
}
