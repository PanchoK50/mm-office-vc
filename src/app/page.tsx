import Image from "next/image";
import { CopyButton } from "@/components/CopyButton";
import { SpaceCounter } from "@/components/SpaceCounter";
import { FloatingPaths } from "@/components/ui/background-paths";
import {
  BANK_DETAILS,
  DEMO_DAY,
  HACK_NATION_POST_ID,
  JOINERS,
  PRICE_PER_SPACE,
  RECENT_WINS,
  SPACES_FILLED,
  SPACES_TOTAL,
} from "@/content/data";

export default function Home() {
  const price = PRICE_PER_SPACE.toLocaleString("de-DE");
  const totalRaise = (PRICE_PER_SPACE * SPACES_TOTAL).toLocaleString("de-DE");

  return (
    <>
      {/* ——— Nav ——— */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-bg/70 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <a
            href="#top"
            className="flex items-center gap-3 text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded"
            aria-label="Manage and More — Incubator"
          >
            <Image
              src="/MM_3.png"
              alt="Manage and More"
              width={1181}
              height={413}
              priority
              className="h-12 w-auto sm:h-14"
            />
            <span
              aria-hidden="true"
              className="hidden font-mono text-[11px] uppercase tracking-[0.22em] text-muted sm:inline"
            >
              <span className="text-accent">·</span>&nbsp;Incubator
            </span>
          </a>
          <a
            href="#reserve"
            className="rounded-full border border-hairline-strong bg-surface px-4 py-1.5 text-xs font-medium tracking-wide text-fg transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Reserve a space →
          </a>
        </div>
      </header>

      <main id="top" className="flex flex-col">
        {/* ——— Hero ——— */}
        <section className="relative isolate overflow-hidden px-6 pb-28 pt-40 sm:pt-48 lg:pt-56 grain">
          <div className="mesh absolute inset-0 -z-10" aria-hidden="true" />
          <div
            className="absolute inset-0 -z-10 rotate-180 opacity-60"
            aria-hidden="true"
          >
            <FloatingPaths position={1} />
            <FloatingPaths position={-1} />
          </div>
          <div className="mx-auto max-w-5xl">
            
            <h1 className="fade-up-slow mt-8 text-balance text-[clamp(2.75rem,8.5vw,6.75rem)] font-medium leading-[0.95] tracking-[-0.03em] text-fg">
              For years, we said MM had
              <br className="hidden sm:block" />{" "}
              <span className="text-muted">so much</span> potential.
            </h1>
            <p className="fade-up-slower mt-8 max-w-[54ch] text-balance text-lg leading-[1.55] text-muted sm:text-xl">
              We&rsquo;re opening the first office for Manage &amp; More&rsquo;, and are bringing the best founding
              teams together. 
            </p>
            <div className="fade-up-slower mt-12 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#reserve"
                className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold tracking-wide text-[#0b0b0f] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                Reserve a space — €{price}
              </a>
              <a
                href="#plan"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-hairline px-6 text-sm font-medium tracking-wide text-fg transition hover:border-hairline-strong"
              >
                See the plan
                <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </section>

        {/* ——— Traction strip ——— */}
        <section
          id="plan"
          className="border-y border-hairline bg-surface/40 px-6 py-20 sm:py-24"
        >
          <div className="mx-auto max-w-6xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-muted">
              Momentum&nbsp;&nbsp;·&nbsp;&nbsp;April 2026
            </p>
            <p className="mt-6 max-w-[52ch] text-balance text-2xl font-medium leading-[1.25] tracking-tight text-fg sm:text-[28px]">
              In the last 48 hours, we funded our active generation&rsquo;s
              space.{" "}
              <span className="text-muted">
                Now we&rsquo;re building the incubator.
              </span>
            </p>
            <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline sm:grid-cols-3">
              <Metric value="48h" label="To fund the first space" />
              <Metric
                value={`€${totalRaise}`}
                label="Target — 4 spaces × €7,500"
              />
              <Metric
                value={`${SPACES_FILLED}/${SPACES_TOTAL}`}
                label="Incubator spaces funded"
                accent
              />
            </div>
          </div>
        </section>

        {/* ——— The Ask ——— */}
        <section id="reserve" className="px-6 py-28 sm:py-36 scroll-mt-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 max-w-3xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-accent">
                The ask
              </p>
              <h2 className="mt-4 text-balance text-4xl font-medium leading-[1.05] tracking-[-0.02em] sm:text-5xl">
                €7,500 per space. Four spaces. Your spot is assigned the moment
                the wire lands.
              </h2>
            </div>

            <div className="overflow-hidden rounded-3xl border border-hairline bg-surface">
              <div className="grid gap-10 p-8 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:p-14">
                <div className="flex flex-col justify-between gap-10">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-muted">
                      What you get
                    </p>
                    <ul className="mt-6 space-y-4 text-[17px] leading-[1.55] text-fg/90">
                      <li className="flex gap-3">
                        <Dot /> A founding seat in the M&amp;M Incubator.
                      </li>
                      <li className="flex gap-3">
                        <Dot /> Demo Day access — 1st-semester teams through
                        alumni pitches.
                      </li>
                      <li className="flex gap-3">
                        <Dot /> Hack Nation investor access (Start2 / CDTM
                        office).
                      </li>
                      <li className="flex gap-3">
                        <Dot /> A named plaque on the space. Permanently.
                      </li>
                    </ul>
                  </div>
                  <p className="text-sm leading-[1.6] text-muted">
                    Direct bank transfer. No forms. No platform. The reference
                    line <em className="not-italic text-fg">is</em> the capture
                    — we email you within 24h of the wire clearing.
                  </p>
                </div>

                <div className="flex flex-col justify-center">
                  <SpaceCounter />
                </div>
              </div>

              {/* Bank details */}
              <div className="border-t border-hairline bg-bg/60 p-8 sm:p-10 lg:p-14">
                <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-muted">
                  Wire details
                </p>
                <div className="mt-6 divide-y divide-hairline">
                  <BankRow
                    label="Recipient"
                    value={BANK_DETAILS.recipient}
                  />
                  <BankRow label="IBAN" value={BANK_DETAILS.iban} mono />
                  <BankRow label="BIC" value={BANK_DETAILS.bic} mono />
                  <BankRow label="Bank" value={BANK_DETAILS.bank} />
                  <BankRow
                    label="Reference"
                    value={BANK_DETAILS.reference}
                    mono
                    hint="Replace <YOUR-LASTNAME> with your surname so we can match the wire to your seat."
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ——— Recent wins (alumni raises) ——— */}
        <section className="border-t border-hairline bg-surface/30 px-6 py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="mt-4 max-w-2xl text-balance text-4xl font-medium leading-[1.05] tracking-[-0.02em] sm:text-5xl">
                  MM alumni closed rounds{" "}
                  <span className="text-muted">in the last 3 months.</span>
                </h2>
              </div>
              
            </div>
            <ul className="grid gap-6 sm:grid-cols-2">
              {RECENT_WINS.map((w) => (
                <li
                  key={w.postId}
                  className="flex flex-col gap-4 rounded-2xl border border-hairline bg-surface p-5 transition hover:border-hairline-strong"
                >
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-lg font-medium tracking-tight text-fg">
                      {w.name}
                    </h3>
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                      {w.tag}
                    </span>
                  </div>
                  <LinkedInPost
                    postId={w.postId}
                    title={`${w.name} — raise announcement`}
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ——— Who moves in (joiners) ——— */}
        <section className="border-t border-hairline px-6 py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-muted">
                  Who moves in
                </p>
                <h2 className="mt-4 max-w-2xl text-balance text-4xl font-medium leading-[1.05] tracking-[-0.02em] sm:text-5xl">
                  The teams you&rsquo;d meet on day one.
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-[1.6] text-muted">
                Active generations are already shipping — EWOR, Y Combinator,
                and independent labs. The incubator is where they&rsquo;d sit.
              </p>
            </div>
            <ul className="grid gap-6 md:grid-cols-3">
              {JOINERS.map((j) => (
                <li
                  key={j.name}
                  className="group flex flex-col gap-5 rounded-2xl border border-hairline bg-surface p-7 transition hover:border-hairline-strong"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                    {j.tag}
                  </span>
                  <h3 className="text-2xl font-medium tracking-tight text-fg">
                    {j.name}
                  </h3>
                  <p className="text-[15px] leading-[1.55] text-muted">
                    {j.line}
                  </p>
                  <div className="mt-auto pt-2">
                    {j.linkedin.kind === "post" ? (
                      <LinkedInPost
                        postId={j.linkedin.postId}
                        title={`${j.name} — LinkedIn post`}
                      />
                    ) : (
                      <a
                        href={j.linkedin.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-2 text-xs font-medium tracking-wide text-fg transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                      >
                        View on LinkedIn
                        <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ——— Access pull-quote ——— */}
        <section className="px-6 py-28">
          <div className="mx-auto max-w-4xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-muted">
              Why now
            </p>
            <blockquote className="mt-8 border-l-2 border-accent pl-8 text-balance text-3xl font-medium leading-[1.2] tracking-tight text-fg sm:text-4xl sm:leading-[1.15]">
              Until now, only Unternehmertum founders had physical incubator
              access in Munich.{" "}
              <span className="text-muted">This opens it — to MM.</span>
            </blockquote>
          </div>
        </section>

        {/* ——— What investors get ——— */}
        <section className="border-t border-hairline bg-surface/40 px-6 py-28">
          <div className="mx-auto max-w-6xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-muted">
              What investors get
            </p>
            <h2 className="mt-4 max-w-2xl text-balance text-4xl font-medium leading-[1.05] tracking-[-0.02em] sm:text-5xl">
              Two windows into the pipeline.
            </h2>

            <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline lg:grid-cols-2">
              {/* Demo Day */}
              <div className="flex flex-col gap-8 bg-surface p-10">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-medium tracking-tight">
                    Demo Day
                  </h3>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                    One evening · Semester close
                  </span>
                </div>
                <ol className="space-y-5">
                  {DEMO_DAY.map((d, i) => (
                    <li
                      key={d.label}
                      className="flex items-start gap-6 border-l border-hairline pl-6"
                    >
                      <span className="font-mono text-xs tracking-[0.18em] text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                          {d.stage}
                        </p>
                        <p className="mt-1 text-lg text-fg">{d.label}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <p className="mt-auto text-sm leading-[1.6] text-muted">
                  Seated access, plus a pre-event founder dinner with the top
                  teams.
                </p>
              </div>

              {/* Hack Nation */}
              <div className="flex flex-col gap-6 bg-surface p-10">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-medium tracking-tight">
                    Hack Nation
                  </h3>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                    48h · Start2 / CDTM
                  </span>
                </div>
                <p className="text-[15px] leading-[1.55] text-fg">
                  Our hackathon, currently hosted at the{" "}
                  <span className="text-accent">Start2 / CDTM office</span>.
                  You&rsquo;d walk in alongside the teams.
                </p>
                <ul className="space-y-2 text-sm text-muted">
                  <li className="flex items-center gap-3">
                    <Dot /> Investor access included
                  </li>
                  <li className="flex items-center gap-3">
                    <Dot /> Judging & mentor slot on request
                  </li>
                </ul>
                <div className="mt-auto">
                  <LinkedInPost
                    postId={HACK_NATION_POST_ID}
                    title="Hack Nation — recap"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ——— Final CTA ——— */}
        <section className="border-t border-hairline px-6 py-32">
          <div className="mx-auto max-w-4xl text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-accent">
              Last call
            </p>
            <h2 className="mt-6 text-balance text-5xl font-medium leading-[1.02] tracking-[-0.025em] sm:text-6xl">
              Four spaces.
              <br />
              <span className="text-muted">One wire transfer away.</span>
            </h2>
            <div className="mx-auto mt-14 max-w-md">
              <SpaceCounter compact />
            </div>
            <a
              href="#reserve"
              className="mt-12 inline-flex h-12 items-center justify-center rounded-full bg-accent px-7 text-sm font-semibold tracking-wide text-[#0b0b0f] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              Reserve a space — €{price}
            </a>
          </div>
        </section>

        {/* ——— Footer ——— */}
        <footer className="border-t border-hairline px-6 py-10">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted sm:flex-row sm:items-center">
            <span>M&amp;M · Manage and More e.V.</span>
            <span>
              <a
                href="mailto:incubator@manage-and-more.de"
                className="hover:text-fg"
              >
                incubator@manage-and-more.de
              </a>
            </span>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </footer>
      </main>
    </>
  );
}

function Metric({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 bg-surface p-8 sm:p-10">
      <span
        className={`font-mono text-[10px] uppercase tracking-[0.24em] ${
          accent ? "text-accent" : "text-muted"
        }`}
      >
        {label}
      </span>
      <span className="text-4xl font-medium tracking-tight text-fg sm:text-5xl">
        {value}
      </span>
    </div>
  );
}

function LinkedInPost({ postId, title }: { postId: string; title: string }) {
  return (
    <iframe
      src={`https://www.linkedin.com/embed/feed/update/urn:li:activity:${postId}`}
      title={title}
      loading="lazy"
      allow="encrypted-media"
      className="block h-[540px] w-full rounded-xl border border-hairline bg-surface-2"
    />
  );
}

function Dot() {
  return (
    <span
      aria-hidden="true"
      className="mt-[0.6em] inline-block h-1 w-1 shrink-0 rounded-full bg-accent"
    />
  );
}

function BankRow({
  label,
  value,
  mono,
  hint,
}: {
  label: string;
  value: string;
  mono?: boolean;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted sm:w-32">
        {label}
      </span>
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
        <span
          className={`break-all text-fg ${mono ? "font-mono text-[15px] tracking-wide" : "text-[16px]"}`}
        >
          {value}
        </span>
        <CopyButton value={value} label={label} />
      </div>
      {hint ? (
        <p className="mt-1 text-xs leading-[1.55] text-muted sm:mt-2 sm:w-full sm:text-right">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
