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
              className="reserve-dialog fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-4"
              onClick={() => setOpen(false)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative flex max-h-[100dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-hairline bg-bg shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] sm:max-h-[95dvh]"
              >
                <div className="flex items-start justify-between gap-4 px-5 pt-5 sm:px-7 sm:pt-6">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
                      Reserve a space
                    </p>
                    <h3 className="mt-1.5 text-balance text-[19px] font-medium leading-[1.2] tracking-[-0.015em] text-fg sm:text-[22px]">
                      Wire €{price} &mdash; then confirm below.
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-hairline text-muted transition hover:border-hairline-strong hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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

                <div className="grid min-h-0 flex-1 gap-0 overflow-y-auto px-5 py-5 sm:grid-cols-2 sm:gap-6 sm:px-7 sm:py-6">
                  <div className="flex min-w-0 flex-col">
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
                        Wire details
                      </p>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/60">
                        SEPA
                      </span>
                    </div>
                    <div className="mt-2 divide-y divide-hairline">
                      <WireRow label="Recipient" value={BANK_DETAILS.recipient} />
                      <WireRow label="IBAN" value={BANK_DETAILS.iban} mono />
                      <WireRow label="BIC" value={BANK_DETAILS.bic} mono />
                      <WireRow label="Bank" value={BANK_DETAILS.bank} />
                    </div>
                  </div>

                  <div className="mt-5 flex min-w-0 flex-col border-t border-hairline pt-5 sm:mt-0 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
                      Confirm your transfer
                    </p>
                    <p className="mt-1.5 mb-4 text-[12.5px] leading-[1.5] text-muted">
                      Upload your payment confirmation to reserve instantly.
                    </p>
                    <ClaimForm spotsAvailable={spotsAvailable} />
                  </div>
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
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        {label}
      </span>
      <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
        <span
          className={`truncate text-fg ${mono ? "font-mono text-[12.5px] tracking-wide" : "text-[13px]"}`}
          title={value}
        >
          {value}
        </span>
        <CopyButton value={value} label={label} />
      </div>
    </div>
  );
}
