"use server";

import { encryptAndReverse, decryptAndReverse } from "@/lib/crypto";

export async function encryptData(
  _prevState: { success: boolean; message: string; result?: string },
  formData: FormData
): Promise<{ success: boolean; message: string; result?: string }> {
  const plainText = formData.get("plainText") as string | null;

  if (!plainText) {
    return { success: false, message: "Please enter text to encrypt." };
  }

  try {
    console.log("[crypto] Key length:", process.env.SC_ENCRYPTION_KEY?.length);
    console.log("[crypto] Key available:", !!process.env.SC_ENCRYPTION_KEY);
    const encrypted = encryptAndReverse(plainText);
    return {
      success: true,
      message: "Text encrypted successfully.",
      result: encrypted,
    };
  } catch (err) {
    console.error("[crypto] Encrypt error:", err);
    return {
      success: false,
      message: "Encryption failed. Please check your encryption key is configured.",
    };
  }
}

export async function decryptData(
  _prevState: { success: boolean; message: string; result?: string },
  formData: FormData
): Promise<{ success: boolean; message: string; result?: string }> {
  const cipherText = formData.get("cipherText") as string | null;

  if (!cipherText) {
    return { success: false, message: "Please enter text to decrypt." };
  }

  try {
    const decrypted = decryptAndReverse(cipherText);
    return {
      success: true,
      message: "Text decrypted successfully.",
      result: decrypted,
    };
  } catch (err) {
    console.error("[crypto] Decrypt error:", err);
    return {
      success: false,
      message: "Decryption failed. Invalid or corrupted cipher format.",
    };
  }
}
