"use client";

import { useActionState } from "react";
import { encryptData, decryptData } from "@/app/actions/crypto";

export default function CryptoPage() {
  const [encryptState, encryptAction, encryptPending] = useActionState(
    encryptData,
    { success: false, message: "", result: undefined }
  );
  const [decryptState, decryptAction, decryptPending] = useActionState(
    decryptData,
    { success: false, message: "", result: undefined }
  );

  return (
    <div className="min-h-screen bg-background pt-10 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4">
            Encryption Tool.
          </h1>
          <p className="text-foreground/60 max-w-xl mx-auto">
            Encrypt and decrypt text using AES-256-CBC encryption.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Encrypt Form */}
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-border/40">
            <h2 className="font-serif text-2xl text-primary mb-8">Encrypt</h2>

            <form action={encryptAction} className="space-y-6">
              <div>
                <label className="text-xs uppercase tracking-widest text-foreground/70 block mb-1">
                  Plain Text *
                </label>
                <textarea
                  name="plainText"
                  required
                  rows={5}
                  className="w-full bg-transparent border-b border-border/60 py-3 focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-muted-foreground"
                  placeholder="Enter text to encrypt"
                />
              </div>

              <button
                type="submit"
                disabled={encryptPending}
                className="w-full py-4 bg-primary text-white rounded-full font-medium tracking-wide uppercase text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {encryptPending ? "Encrypting..." : "Encrypt"}
              </button>

              {encryptState.message && (
                <div className="pt-4">
                  {encryptState.success && encryptState.result ? (
                    <div>
                      <p className="text-xs uppercase tracking-widest text-foreground/70 mb-2">
                        Encrypted Result
                      </p>
                      <output className="p-4 bg-muted rounded-lg break-all font-mono text-sm w-full block">
                        {encryptState.result}
                      </output>
                    </div>
                  ) : (
                    <p className="text-sm text-red-600">{encryptState.message}</p>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Decrypt Form */}
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-border/40">
            <h2 className="font-serif text-2xl text-primary mb-8">Decrypt</h2>

            <form action={decryptAction} className="space-y-6">
              <div>
                <label className="text-xs uppercase tracking-widest text-foreground/70 block mb-1">
                  Encrypted Text *
                </label>
                <textarea
                  name="cipherText"
                  required
                  rows={5}
                  className="w-full bg-transparent border-b border-border/60 py-3 focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-muted-foreground"
                  placeholder="Enter encrypted text (format: iv:encrypted)"
                />
              </div>

              <button
                type="submit"
                disabled={decryptPending}
                className="w-full py-4 bg-primary text-white rounded-full font-medium tracking-wide uppercase text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {decryptPending ? "Decrypting..." : "Decrypt"}
              </button>

              {decryptState.message && (
                <div className="pt-4">
                  {decryptState.success && decryptState.result ? (
                    <div>
                      <p className="text-xs uppercase tracking-widest text-foreground/70 mb-2">
                        Decrypted Result
                      </p>
                      <output className="p-4 bg-muted rounded-lg break-all font-mono text-sm w-full block">
                        {decryptState.result}
                      </output>
                    </div>
                  ) : (
                    <p className="text-sm text-red-600">{decryptState.message}</p>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
