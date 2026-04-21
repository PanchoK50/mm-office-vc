"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { submitClaim, type ClaimResult } from "@/app/actions";
import { CopyButton } from "./CopyButton";
import { BANK_DETAILS } from "@/content/data";

const ACCEPTED = "image/jpeg,image/png,image/webp,application/pdf";
const MAX_SIZE = 5 * 1024 * 1024;
const WHATSAPP_NUMBER = "491608340629";

type Step = 1 | 2;

export function ReserveDialog({
  spotsAvailable,
  price,
}: {
  spotsAvailable: number;
  price: string;
}) {
  const [open, setOpen] = useState(false);

  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fundName, setFundName] = useState("");
  const [stepError, setStepError] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [confirmationMethod, setConfirmationMethod] = useState<
    "upload" | "whatsapp" | null
  >(null);

  const [result, setResult] = useState<ClaimResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const disabled = spotsAvailable === 0;

  function resetState() {
    setStep(1);
    setName("");
    setEmail("");
    setPhone("");
    setFundName("");
    setStepError("");
    setFile(null);
    setFileError("");
    setConfirmationMethod(null);
    setResult(null);
  }

  function close() {
    setOpen(false);
    setTimeout(resetState, 150);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleStep1Next() {
    setStepError("");
    if (!name.trim()) {
      setStepError("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      setStepError("Please enter your email.");
      return;
    }
    if (!phone.trim()) {
      setStepError("Please enter your phone number.");
      return;
    }
    if (!fundName.trim()) {
      setStepError("Please enter your fund name.");
      return;
    }
    setStep(2);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError("");
    const f = e.target.files?.[0];
    if (!f) {
      setFile(null);
      return;
    }
    if (f.size > MAX_SIZE) {
      setFileError("File must be under 5 MB.");
      e.target.value = "";
      setFile(null);
      setConfirmationMethod(null);
      return;
    }
    setFile(f);
    setConfirmationMethod("upload");
  }

  function handleWhatsapp() {
    const text = encodeURIComponent(
      `Hi, I just wired €${price} for an MM Incubator space. Name: ${name}. Fund: ${fundName}.`,
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
    setConfirmationMethod("whatsapp");
    setFile(null);
    setFileError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleFinalConfirm() {
    setStepError("");
    if (!confirmationMethod) {
      setStepError("Upload a confirmation or choose the WhatsApp option.");
      return;
    }
    const fd = new FormData();
    fd.set("name", name);
    fd.set("email", email);
    fd.set("phone", phone);
    fd.set("fund_name", fundName);
    if (file) fd.set("file", file);
    if (confirmationMethod === "whatsapp") fd.set("via_whatsapp", "true");

    startTransition(async () => {
      const res = await submitClaim(fd);
      setResult(res);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={disabled}
        className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-md bg-[#00a2cc] text-sm font-semibold tracking-wide text-[#0b0b0f] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a2cc] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100"
      >
        <span>{disabled ? "All spots taken" : "Secure your access"}</span>
        {!disabled && (
          <svg
            viewBox="0 0 16 16"
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8h10m-4-4l4 4-4 4"
            />
          </svg>
        )}
      </button>

      {open
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Secure your access"
              className="reserve-dialog fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
              onClick={close}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative flex max-h-[100dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-hairline bg-bg p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] sm:max-h-[92dvh] sm:rounded-2xl"
              >
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="absolute right-4 top-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-hairline text-muted transition hover:border-hairline-strong hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      d="M4 4l8 8M12 4l-8 8"
                    />
                  </svg>
                </button>

                {/* Step indicator */}
                {!result?.ok && (
                  <div className="mb-6 flex items-center justify-center gap-2">
                    {[1, 2].map((s) => (
                      <div
                        key={s}
                        className={`h-2 w-2 rounded-full transition-colors ${
                          s <= step ? "bg-accent" : "bg-hairline-strong"
                        }`}
                      />
                    ))}
                  </div>
                )}

                <div className="min-h-0 flex-1 overflow-y-auto">
                  {/* Success */}
                  {result?.ok && (
                    <div className="space-y-4 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                        <svg viewBox="0 0 16 16" className="h-6 w-6 text-accent" aria-hidden="true">
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
                      <h2 className="text-2xl font-semibold tracking-tight text-fg">
                        You&rsquo;re in.
                      </h2>
                      <p className="mx-auto max-w-sm text-[14px] leading-relaxed text-muted">
                        {result.message}
                      </p>
                      <p className="text-sm text-muted">
                        {name} · {fundName}
                      </p>
                      <button
                        type="button"
                        onClick={close}
                        className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-[#0b0b0f] transition hover:brightness-110"
                      >
                        Close
                      </button>
                    </div>
                  )}

                  {/* Step 1 — details */}
                  {!result?.ok && step === 1 && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
                          Step 1 of 2
                        </p>
                        <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-fg sm:text-2xl">
                          Your details
                        </h2>
                        <p className="mt-1 text-sm text-muted">
                          Tell us who you are and which fund you&rsquo;re
                          coming from.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <Field label="Full name">
                          <input
                            type="text"
                            autoComplete="name"
                            value={name}
                            onChange={(e) => {
                              setName(e.target.value);
                              setStepError("");
                            }}
                            placeholder="Max Mustermann"
                            className="h-11 w-full rounded-lg border border-hairline bg-surface-2/60 px-4 text-[14px] text-fg placeholder:text-muted/50 outline-none transition focus:border-accent"
                          />
                        </Field>

                        <Field label="Email">
                          <input
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setStepError("");
                            }}
                            placeholder="you@example.com"
                            className="h-11 w-full rounded-lg border border-hairline bg-surface-2/60 px-4 text-[14px] text-fg placeholder:text-muted/50 outline-none transition focus:border-accent"
                          />
                        </Field>

                        <Field label="Fund">
                          <input
                            type="text"
                            value={fundName}
                            onChange={(e) => {
                              setFundName(e.target.value);
                              setStepError("");
                            }}
                            placeholder=""
                            className="h-11 w-full rounded-lg border border-hairline bg-surface-2/60 px-4 text-[14px] text-fg placeholder:text-muted/50 outline-none transition focus:border-accent"
                          />
                        </Field>

                        <Field label="Phone">
                          <input
                            type="tel"
                            autoComplete="tel"
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value);
                              setStepError("");
                            }}
                            placeholder="+49 170 1234567"
                            className="h-11 w-full rounded-lg border border-hairline bg-surface-2/60 px-4 text-[14px] text-fg placeholder:text-muted/50 outline-none transition focus:border-accent"
                          />
                        </Field>
                      </div>

                      {stepError && (
                        <p className="text-sm text-red-500" role="alert">
                          {stepError}
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={handleStep1Next}
                        disabled={disabled}
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent text-sm font-semibold text-[#0b0b0f] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Continue
                        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
                          <path
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 8h10m-4-4l4 4-4 4"
                          />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Step 2 — transfer & confirm */}
                  {!result?.ok && step === 2 && (
                    <div className="space-y-5">
                      <div className="text-center">
                        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
                          Step 2 of 2
                        </p>
                        <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-fg sm:text-2xl">
                          Wire €{price} &amp; confirm
                        </h2>
                        <p className="mt-1 text-sm text-muted">
                          Your spot is claimed once you confirm below.
                        </p>
                      </div>

                      {/* Bank details */}
                      <div className="space-y-1 rounded-xl border border-hairline bg-surface-2/60 p-4 text-sm">
                        <Row label="Account holder" value={BANK_DETAILS.accountHolder} />
                        <Row label="IBAN" value={BANK_DETAILS.iban} mono />
                        <Row label="BIC" value={BANK_DETAILS.bic} mono />
                        <Row label="Reference" value={BANK_DETAILS.reference} />
                        <Row label="Amount" value={`€${price}`} emphasis />
                      </div>

                      {/* Confirmation methods */}
                      <div className="space-y-2.5">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                          Confirm your transfer
                        </p>

                        <label
                          className={`flex min-h-[56px] w-full cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-colors ${
                            confirmationMethod === "upload"
                              ? "border-accent bg-accent/5 text-fg"
                              : "border-hairline bg-surface-2/40 text-fg hover:bg-surface-2"
                          }`}
                        >
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                              confirmationMethod === "upload"
                                ? "bg-accent text-[#0b0b0f]"
                                : "bg-surface-2 text-muted"
                            }`}
                            aria-hidden="true"
                          >
                            {confirmationMethod === "upload" ? (
                              <svg viewBox="0 0 16 16" className="h-5 w-5">
                                <path
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M3 8.5l3.5 3.5L13 5"
                                />
                              </svg>
                            ) : (
                              <svg viewBox="0 0 24 24" className="h-5 w-5">
                                <path
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.75"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 16V6m0 0l-4 4m4-4l4 4M4 18h16"
                                />
                              </svg>
                            )}
                          </span>
                          <span className="flex-1 text-left">
                            {file
                              ? file.name
                              : "Upload payment confirmation (image or PDF)"}
                          </span>
                          {confirmationMethod === "upload" && (
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                              Selected
                            </span>
                          )}
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept={ACCEPTED}
                            disabled={isPending}
                            onChange={handleFileChange}
                            className="sr-only"
                          />
                        </label>
                        {fileError && (
                          <p className="text-xs text-red-500" role="alert">
                            {fileError}
                          </p>
                        )}

                        <button
                          type="button"
                          onClick={handleWhatsapp}
                          disabled={isPending}
                          className={`flex min-h-[56px] w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-colors ${
                            confirmationMethod === "whatsapp"
                              ? "border-accent bg-accent/5 text-fg"
                              : "border-hairline bg-surface-2/40 text-fg hover:bg-surface-2"
                          }`}
                        >
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                              confirmationMethod === "whatsapp"
                                ? "bg-accent text-[#0b0b0f]"
                                : "bg-surface-2 text-muted"
                            }`}
                            aria-hidden="true"
                          >
                            {confirmationMethod === "whatsapp" ? (
                              <svg viewBox="0 0 16 16" className="h-5 w-5">
                                <path
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M3 8.5l3.5 3.5L13 5"
                                />
                              </svg>
                            ) : (
                              <svg viewBox="0 0 24 24" className="h-5 w-5">
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
                            )}
                          </span>
                          <span className="flex-1 text-left">
                            Send screenshot via WhatsApp
                          </span>
                          {confirmationMethod === "whatsapp" && (
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                              Selected
                            </span>
                          )}
                        </button>
                      </div>

                      {stepError && (
                        <p className="text-sm text-red-500" role="alert">
                          {stepError}
                        </p>
                      )}
                      {result && !result.ok && (
                        <p className="rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-500">
                          {result.error}
                        </p>
                      )}

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          disabled={isPending}
                          className="h-12 flex-1 rounded-xl border border-hairline bg-surface-2/40 text-sm font-medium text-fg transition hover:bg-surface-2 disabled:opacity-50"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={handleFinalConfirm}
                          disabled={isPending || !confirmationMethod || disabled}
                          className="h-12 flex-[2] rounded-xl bg-accent text-sm font-semibold text-[#0b0b0f] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isPending
                            ? "Claiming\u2026"
                            : disabled
                              ? "All spots taken"
                              : "Claim my spot"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

function Row({
  label,
  value,
  mono,
  emphasis,
}: {
  label: string;
  value: string;
  mono?: boolean;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        {label}
      </span>
      <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5">
        <span
          className={`truncate text-fg ${
            mono
              ? "font-mono text-[12.5px] tracking-wide"
              : emphasis
                ? "text-[13px] font-semibold"
                : "text-[13px]"
          }`}
          title={value}
        >
          {value}
        </span>
        <CopyButton value={value} label={label} />
      </div>
    </div>
  );
}
