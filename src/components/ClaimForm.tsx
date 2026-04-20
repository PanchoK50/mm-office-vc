"use client";

import { useRef, useState, useTransition } from "react";
import { submitClaim, type ClaimResult } from "@/app/actions";

const ACCEPTED = ".jpg,.jpeg,.png,.webp,.pdf";
const MAX_SIZE = 5 * 1024 * 1024;
const WHATSAPP_NUMBER = "PLACEHOLDER";

export function ClaimForm({ spotsAvailable }: { spotsAvailable: number }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ClaimResult | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [viaWhatsapp, setViaWhatsapp] = useState(false);

  const disabled = spotsAvailable === 0;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) {
      setFileName(null);
      return;
    }
    if (file.size > MAX_SIZE) {
      setFileError("File must be under 5 MB.");
      e.target.value = "";
      setFileName(null);
      return;
    }
    setFileName(file.name);
    setViaWhatsapp(false);
  }

  function handleSubmit(formData: FormData) {
    if (viaWhatsapp) {
      formData.set("via_whatsapp", "true");
    }
    startTransition(async () => {
      const res = await submitClaim(formData);
      setResult(res);
      if (res.ok) {
        formRef.current?.reset();
        setFileName(null);
        setViaWhatsapp(false);
      }
    });
  }

  if (result?.ok) {
    return (
      <div className="rounded-2xl border border-accent/30 bg-accent/5 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
          <svg
            viewBox="0 0 16 16"
            className="h-5 w-5 text-accent"
            aria-hidden="true"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8.5l3.5 3.5L13 5"
            />
          </svg>
        </div>
        <p className="text-lg font-medium text-fg">{result.message}</p>
        <p className="mt-2 text-sm text-muted">
          We&rsquo;ll email you once the wire clears.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            Full name
          </span>
          <input
            name="name"
            type="text"
            required
            disabled={disabled || isPending}
            placeholder="Max Mustermann"
            className="rounded-lg border border-hairline bg-surface-2/60 px-4 py-3 text-[15px] text-fg placeholder:text-muted/40 transition focus:border-accent focus:outline-none disabled:opacity-50"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            Email
          </span>
          <input
            name="email"
            type="email"
            required
            disabled={disabled || isPending}
            placeholder="you@example.com"
            className="rounded-lg border border-hairline bg-surface-2/60 px-4 py-3 text-[15px] text-fg placeholder:text-muted/40 transition focus:border-accent focus:outline-none disabled:opacity-50"
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          Phone / WhatsApp{" "}
          <span className="normal-case tracking-normal text-muted/60">
            (optional)
          </span>
        </span>
        <input
          name="phone"
          type="tel"
          disabled={disabled || isPending}
          placeholder="+49 170 1234567"
          className="rounded-lg border border-hairline bg-surface-2/60 px-4 py-3 text-[15px] text-fg placeholder:text-muted/40 transition focus:border-accent focus:outline-none disabled:opacity-50"
        />
      </label>

      {!viaWhatsapp && (
        <label className="flex flex-col gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            Payment confirmation
          </span>
          <div className="group relative flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-hairline-strong bg-surface-2/30 p-6 transition hover:border-accent/50 hover:bg-surface-2/50">
            <input
              name="file"
              type="file"
              accept={ACCEPTED}
              disabled={disabled || isPending}
              onChange={handleFileChange}
              className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
            />
            {fileName ? (
              <>
                <svg
                  viewBox="0 0 16 16"
                  className="h-5 w-5 text-accent"
                  aria-hidden="true"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8.5l3.5 3.5L13 5"
                  />
                </svg>
                <span className="text-sm text-fg">{fileName}</span>
              </>
            ) : (
              <>
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6 text-muted/60"
                  aria-hidden="true"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16V6m0 0l-4 4m4-4l4 4M4 18h16"
                  />
                </svg>
                <span className="text-sm text-muted">
                  Drop a screenshot or PDF here, or click to browse
                </span>
                <span className="text-xs text-muted/50">
                  JPEG, PNG, WebP, or PDF &middot; max 5 MB
                </span>
              </>
            )}
          </div>
          {fileError && (
            <p className="text-xs text-red-400">{fileError}</p>
          )}
        </label>
      )}

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-hairline" />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/60">
          or
        </span>
        <div className="h-px flex-1 bg-hairline" />
      </div>

      <button
        type="button"
        disabled={disabled || isPending}
        onClick={() => {
          setViaWhatsapp(!viaWhatsapp);
          setFileName(null);
          setFileError(null);
        }}
        className={`flex w-full items-center justify-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 ${
          viaWhatsapp
            ? "border-accent/40 bg-accent/10 text-accent"
            : "border-hairline bg-surface-2/40 text-muted hover:border-hairline-strong hover:text-fg"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path
            fill="currentColor"
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
          />
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 01-4.11-1.14l-.29-.174-2.86.85.85-2.86-.18-.29A7.96 7.96 0 014 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"
            clipRule="evenodd"
          />
        </svg>
        {viaWhatsapp
          ? "Sending proof via WhatsApp"
          : "I\u2019ll send proof via WhatsApp instead"}
      </button>

      {viaWhatsapp && (
        <p className="text-center text-xs text-muted">
          After submitting, send your confirmation screenshot to{" "}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I just wired €7,500 for an MM Incubator space.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-2 hover:brightness-110"
          >
            our WhatsApp
          </a>
          .
        </p>
      )}

      {result && !result.ok && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {result.error}
        </p>
      )}

      <button
        type="submit"
        disabled={disabled || isPending}
        className="flex h-12 w-full items-center justify-center rounded-full bg-accent text-sm font-semibold tracking-wide text-[#0b0b0f] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:hover:brightness-100"
      >
        {isPending
          ? "Reserving\u2026"
          : disabled
            ? "All spots taken"
            : "Reserve my space"}
      </button>
    </form>
  );
}
