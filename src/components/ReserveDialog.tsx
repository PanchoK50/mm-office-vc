"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ClaimForm } from "./ClaimForm";
import { CopyButton } from "./CopyButton";
import { BANK_DETAILS } from "@/content/data";

export function ReserveDialog({
  spotsAvailable,
  price,
}: {
  spotsAvailable: number;
  price: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const disabled = spotsAvailable === 0;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={disabled}
        className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-md bg-[#00a2cc] text-sm font-semibold tracking-wide text-[#0b0b0f] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a2cc] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100"
      >
        <span>
          {disabled ? "All spots taken" : "Reserve a space"}
        </span>
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

      {mounted && open
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Reserve a space"
              className="reserve-dialog fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
              onClick={() => setOpen(false)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-xl overflow-hidden rounded-t-3xl border border-hairline bg-surface shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)] sm:rounded-3xl"
              >
                <div className="flex items-start justify-between gap-4 p-6 pb-0 sm:p-8 sm:pb-0">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
                      Reserve a space
                    </p>
                    <h3 className="mt-3 text-balance text-[22px] font-medium leading-[1.2] tracking-[-0.015em] text-fg sm:text-2xl">
                      Wire €{price} &mdash; then confirm below.
                    </h3>
                    <p className="mt-2 text-[13px] leading-[1.55] text-muted">
                      Your spot is assigned the moment the wire lands.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline text-muted transition hover:border-hairline-strong hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        d="M4 4l8 8M12 4l-8 8"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mt-8 border-t border-hairline p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
                      Wire details
                    </p>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/60">
                      SEPA
                    </span>
                  </div>
                  <div className="mt-5 divide-y divide-hairline">
                    <WireRow label="Recipient" value={BANK_DETAILS.recipient} />
                    <WireRow label="IBAN" value={BANK_DETAILS.iban} mono />
                    <WireRow label="BIC" value={BANK_DETAILS.bic} mono />
                    <WireRow label="Bank" value={BANK_DETAILS.bank} />
                  </div>
                </div>

                <div className="border-t border-hairline bg-surface-2/30 p-6 sm:p-8">
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
                    Confirm your transfer
                  </p>
                  <p className="mt-2 mb-6 text-[13px] leading-[1.55] text-muted">
                    Upload your payment confirmation to reserve instantly.
                  </p>
                  <ClaimForm spotsAvailable={spotsAvailable} />
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function WireRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        {label}
      </span>
      <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
        <span
          className={`truncate text-fg ${mono ? "font-mono text-[14px] tracking-wide" : "text-[15px]"}`}
          title={value}
        >
          {value}
        </span>
        <CopyButton value={value} label={label} />
      </div>
    </div>
  );
}
