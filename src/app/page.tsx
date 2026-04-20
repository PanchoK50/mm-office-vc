import Image from "next/image";
import { HeaderReserveButton } from "@/components/HeaderReserveButton";
import { OfficethonTimer } from "@/components/OfficethonTimer";
import { ReserveDialog } from "@/components/ReserveDialog";
import { SpaceCounter, type SpotStatus } from "@/components/SpaceCounter";
import { FloatingPaths } from "@/components/ui/background-paths";
import {
  createOfficethonServerClient,
  createServerClient,
} from "@/lib/supabase/server";
import {
  DEMO_DAY,
  HACK_NATION_POST_ID,
  JOINERS,
  PRICE_PER_SPACE,
  RECENT_WINS,
  SPACES_TOTAL,
} from "@/content/data";

export const revalidate = 30;

async function getSpots(): Promise<SpotStatus[]> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("spots")
    .select("id, status")
    .order("id");

  if (!data) return Array.from({ length: SPACES_TOTAL }, () => "open" as const);
  return data.map((s) => s.status as SpotStatus);
}

type OfficeDonation = {
  id: number;
  donor_name: string;
  amount: number;
  generation: string | null;
  created_at: string;
};

async function getOfficeDonations(): Promise<{
  total: number;
  recent: OfficeDonation[];
}> {
  const supabase = createOfficethonServerClient();
  const { data } = await supabase
    .from("donations")
    .select("id, donor_name, amount, generation, created_at, status")
    .neq("status", "rejected")
    .order("created_at", { ascending: false });

  const list = (data ?? []) as (OfficeDonation & { status: string })[];
  const total = list.reduce((sum, d) => sum + (d.amount ?? 0), 0);
  return { total, recent: list.slice(0, 5) };
}

export default async function Home() {
  const [spots, office] = await Promise.all([getSpots(), getOfficeDonations()]);
  const spotsAvailable = spots.filter((s) => s === "open").length;

  const price = PRICE_PER_SPACE.toLocaleString("de-DE");
  const officeTotal = office.total.toLocaleString("de-DE");

  return (
    <>
      {/* ——— Nav ——— */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-bg lg:pr-[440px]">
        <div className="px-6">
          <div className="mx-auto flex h-20 w-full max-w-5xl items-center justify-between">
            <a
              href="#top"
              className="flex items-center gap-3 text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded"
              aria-label="Manage and More Incubator"
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
            <HeaderReserveButton />
          </div>
        </div>
      </header>

      <main id="top" className="relative flex flex-col lg:pr-[440px]">
        {/* ——— Hero ——— */}
        <section className="relative isolate flex min-h-screen flex-col justify-center overflow-hidden px-6 pb-28 pt-32 sm:pt-36 lg:pt-40 grain">
          <div className="mesh absolute inset-0 -z-10" aria-hidden="true" />
          <div
            className="absolute inset-0 -z-10 rotate-180 opacity-60"
            aria-hidden="true"
          >
            <FloatingPaths position={1} />
            <FloatingPaths position={-1} />
          </div>
          <div className="mx-auto w-full max-w-5xl">
            
            <h1 className="fade-up-slow mt-8 text-balance text-[clamp(2.75rem,8.5vw,6.75rem)] font-medium leading-[0.95] tracking-[-0.03em] text-fg">
              Be visible in Munich&rsquo;s
              <br className="hidden sm:block" />{" "}
              <span className="text-muted">next hub</span> for startups.
            </h1>
            <p className="fade-up-slower mt-8 max-w-[54ch] text-balance text-lg leading-[1.55] text-muted sm:text-xl">
              Manage and More is opening an office, and our best startups will move in.
            </p>
            <div className="fade-up-slower mt-12 flex flex-col gap-3 sm:flex-row sm:items-center">
            </div>
          </div>
        </section>

 
 

        {/* ——— Officethon ——— */}
        <section className="border-t border-hairline bg-surface/40 px-6 py-24 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-accent">
                  Officethon · Live
                </p>
                <h2 className="mt-4 max-w-2xl text-balance text-4xl font-medium leading-[1.05] tracking-[-0.02em] sm:text-5xl">
                  Our community is funding the office{" "}
                  <span className="text-muted">in real time.</span>
                </h2>
              </div>
              <a
                href="https://officethon.mm-app.de"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-md border border-hairline-strong bg-surface-2 px-5 text-xs font-medium tracking-wide text-fg transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                officethon.mm-app.de
                <span aria-hidden="true">↗</span>
              </a>
            </div>

            <div className="grid gap-px overflow-hidden rounded-3xl border border-hairline bg-hairline lg:grid-cols-[1fr_1.2fr]">
              <div className="flex flex-col justify-between gap-10 bg-surface p-8 sm:p-10 lg:p-12">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
                    Total raised for the office
                  </p>
                  <p className="mt-6 flex items-baseline gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                      €
                    </span>
                    <span className="text-[44px] font-medium leading-none tracking-[-0.03em] text-fg sm:text-6xl">
                      {officeTotal}
                    </span>
                  </p>
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
                    Live since 19.04. · 13:00
                  </p>
                  <div className="mt-4">
                    <OfficethonTimer />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6 bg-surface p-8 sm:p-10 lg:p-12">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
                  Neuste Spenden
                </p>
                {office.recent.length === 0 ? (
                  <p className="text-[15px] leading-[1.55] text-muted">
                    Noch keine Spenden — sei der Erste.
                  </p>
                ) : (
                  <ul className="divide-y divide-hairline">
                    {office.recent.map((d) => (
                      <li
                        key={d.id}
                        className="flex items-baseline justify-between gap-4 py-3 first:pt-0 last:pb-0"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-[15px] font-medium text-fg">
                            {d.donor_name || "Anonym"}
                          </p>
                          {d.generation ? (
                            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                              {d.generation}
                            </p>
                          ) : null}
                        </div>
                        <span className="font-mono text-base font-medium tabular-nums text-accent sm:text-lg">
                          €{d.amount.toLocaleString("de-DE")}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ——— What you get ——— */}
        <section className="px-6 py-28 sm:py-36">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 max-w-3xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-accent">
                What you get
              </p>
              <h2 className="mt-4 text-balance text-4xl font-medium leading-[1.05] tracking-[-0.02em] sm:text-5xl">
                We&rsquo;re building an incubator{" "}
                <span className="text-muted">for our best startups.</span>
              </h2>
              <p className="mt-6 text-lg leading-[1.55] text-muted">
                Office space in Munich&rsquo;s best location, free for
                the teams we back, so they can accelerate without the overhead.
              </p>

              <p className="mt-8 text-balance text-2xl font-medium leading-[1.3] tracking-[-0.01em] text-fg sm:text-3xl">
                <span className="text-accent">€{price}</span> per space.{" "}
                <span className="text-accent">Four</span> spaces. Your spot is
                assigned{" "}
                <span className="text-muted">
                  the moment the wire lands.
                </span>
              </p>
            </div>

            <ul className="grid gap-px overflow-hidden rounded-3xl border border-hairline bg-hairline md:grid-cols-3">
              <li className="flex flex-col gap-6 bg-surface p-8 sm:p-10 lg:p-12">
                <p className="text-2xl font-medium leading-[1.2] tracking-tight text-fg sm:text-3xl">
                  A named plaque on the space.
                </p>
                <p className="mt-auto text-[15px] leading-[1.55] text-muted">
                  Mounted for one year. Your name on the hub.
                </p>
              </li>
              <li className="flex flex-col gap-6 bg-surface p-8 sm:p-10 lg:p-12">
                <p className="text-2xl font-medium leading-[1.2] tracking-tight text-fg sm:text-3xl">
                  Demo Day access.
                </p>
                <p className="mt-auto text-[15px] leading-[1.55] text-muted">
                  New-generation teams, Startup Projects and alumni pitches —
                  first look at the pipeline.
                </p>
              </li>
              <li className="flex flex-col gap-6 bg-surface p-8 sm:p-10 lg:p-12">
                <p className="text-2xl font-medium leading-[1.2] tracking-tight text-fg sm:text-3xl">
                  Hackathon access.
                </p>
                <p className="mt-auto text-[15px] leading-[1.55] text-muted">
                  Currently in cooperation with Hacknation at the
                  Start2 / CDTM office.
                </p>
              </li>
              <li className="flex flex-col gap-6 bg-surface p-8 sm:p-10 lg:p-12">
                <p className="text-2xl font-medium leading-[1.2] tracking-tight text-fg sm:text-3xl">
                  Fixed spot of your Fund in our curriculum.
                </p>
                <p className="mt-auto text-[15px] leading-[1.55] text-muted">
                  You will meet every new MM scholar at least once.
                </p>
              </li>
            </ul>
          </div>
        </section>

        {/* ——— Floor plan ——— */}
        <section className="border-t border-hairline bg-surface/30 px-6 py-28 sm:py-36">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 max-w-3xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-accent">
                Floor plan
              </p>
              <h2 className="mt-4 text-balance text-4xl font-medium leading-[1.05] tracking-[-0.02em] sm:text-5xl">
                The incubator,{" "}
                <span className="text-muted">from above.</span>
              </h2>
              <p className="mt-6 text-lg leading-[1.55] text-muted">
                Four named spaces, shared kitchen, meeting room — laid out for the
                teams moving in.
              </p>
            </div>

            <div className="overflow-hidden rounded-3xl border border-hairline bg-surface p-4 sm:p-8">
              <Image
                src="/Incuabtion.png"
                alt="Incubator floor plan"
                width={2229}
                height={1146}
                className="h-auto w-full rounded-xl"
              />
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
                    <span className="font-mono text-2xl font-medium uppercase tracking-[0.08em] text-accent sm:text-3xl">
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
                  Who could move in
                </p>
                <h2 className="mt-4 max-w-2xl text-balance text-4xl font-medium leading-[1.05] tracking-[-0.02em] sm:text-5xl">
                  The teams you&rsquo;d meet on day one.
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-[1.6] text-muted">
                Active generations are already shipping — EWOR, Y Combinator,
                and more. The incubator is where they&rsquo;d sit.{" "}
                <a
                  href="https://www.manageandmore.de/people/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fg underline decoration-hairline-strong underline-offset-4 transition hover:text-accent hover:decoration-accent"
                >
                  See our active generations ↗
                </a>
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
                        className="inline-flex items-center gap-2 rounded-md border border-hairline px-4 py-2 text-xs font-medium tracking-wide text-fg transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
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
            
            <blockquote className="mt-8 border-l-2 border-accent pl-8 text-balance text-3xl font-medium leading-[1.2] tracking-tight text-fg sm:text-4xl sm:leading-[1.15]">
              Until now, only Unternehmertum had early access.{" "}
              
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
                  <div>
                    <h3 className="text-2xl font-medium tracking-tight">
                      Demo Day
                    </h3>
                    <p className="mt-1 text-sm text-muted">pitches from</p>
                  </div>
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
              </div>

              {/* Hack Nation */}
              <div className="flex flex-col gap-6 bg-surface p-10">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-medium tracking-tight">
                    Hackathon
                  </h3>
                </div>
                <p className="text-[15px] leading-[1.55] text-fg">
                  Our hackathon, currently hosted at the{" "}
                  <span className="text-accent">Start2 / CDTM office</span>.
                  Now hosted at our own office and open if you invest.
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

        {/* ——— Location ——— */}
        <section className="border-t border-hairline px-6 py-28 sm:py-36">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-accent">
                  Prime location for the next founding hub
                </p>
                <h2 className="mt-4 max-w-2xl text-balance text-4xl font-medium leading-[1.05] tracking-[-0.02em] sm:text-5xl">
                 Where we are.
                </h2>
              </div>
            
            </div>

            <div className="overflow-hidden rounded-3xl border border-hairline bg-surface">
              <div className="grid lg:grid-cols-[1fr_1.35fr]">
                <div className="flex flex-col justify-between gap-10 p-8 sm:p-10 lg:p-14">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-muted">
                      Office
                    </p>
                    <p className="mt-6 text-2xl font-medium leading-[1.25] tracking-tight text-fg sm:text-[28px]">
                      Kunstlabor 2 · Maxvorstadt
                    </p>
                    <p className="mt-3 text-[17px] leading-[1.55] text-muted">
                      Dachauer Str. 90
                      <br />
                      80335 München
                    </p>
                  </div>

                  <ul className="space-y-3 text-sm text-muted">
                    <li className="flex items-center gap-3">
                      <Dot /> 7 min walk from München Hbf
                    </li>
                    <li className="flex items-center gap-3">
                      <Dot /> Tram 20 / 21 — Stiglmaierplatz
                    </li>
                    <li className="flex items-center gap-3">
                      <Dot /> 400m to TUM Main Campus
                    </li>
                  </ul>

                  <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                    <a
                      href="https://www.google.com/maps/dir/?api=1&destination=Kunstlabor+2,+Dachauer+Str.+90,+80335+M%C3%BCnchen"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-hairline-strong bg-surface-2 px-5 text-xs font-medium tracking-wide text-fg transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                    >
                      Get directions
                      <span aria-hidden="true">↗</span>
                    </a>
                    
                  </div>
                </div>

                <div className="relative min-h-[360px] lg:min-h-[520px]">
                  <iframe
                    title="Kunstlabor 2 — Dachauer Str. 90, München"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=11.5530%2C48.1470%2C11.5640%2C48.1545&layer=mapnik&marker=48.15088522540868%2C11.558447304480815"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full border-0 [filter:invert(0.92)_hue-rotate(180deg)_saturate(0.75)_brightness(0.95)_contrast(0.95)]"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,transparent_40%,rgba(0,0,0,0.55)_100%)]"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(13,13,16,0.85)_0%,transparent_18%,transparent_100%)] hidden lg:block"
                  />
                  <div className="pointer-events-none absolute left-6 top-6 flex items-center gap-2 rounded-full border border-hairline-strong bg-bg/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-fg backdrop-blur">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_2px_var(--accent)]" />
                    48.1509° N · 11.5584° E
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ——— Footer ——— */}
        <footer className="border-t border-hairline px-6 py-10">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            <span>
              <a
                href="mailto:felix.hadasch@manageandmore.de"
                className="hover:text-fg"
              >
                felix.hadasch@manageandmore.de
              </a>
            </span>
            <nav className="flex items-center gap-5">
              <a
                href="https://www.manageandmore.de/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-fg"
              >
                Website
              </a>
              <a
                href="https://www.linkedin.com/company/manage-and-more/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-fg"
              >
                LinkedIn
              </a>
              <a
                href="https://www.instagram.com/manageandmore/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-fg"
              >
                Instagram
              </a>
            </nav>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </footer>
      </main>

      {/* ——— Reserve side panel (hovering on lg+, inline on mobile) ——— */}
      <aside
        id="reserve"
        aria-label="Reserve a space"
        className="reserve-panel scroll-mt-24 mx-6 mb-20 mt-4 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_24px_70px_-24px_rgba(0,0,0,0.45)]"
      >
        <div className="relative p-7 pb-6 sm:p-9 sm:pb-7">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
          />
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/70 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            Reservation open
          </div>

          <h2 className="mt-5 text-balance text-[26px] font-medium leading-[1.1] tracking-[-0.02em] text-fg sm:text-[28px]">
            Four spaces.{" "}
            <span className="text-muted">One wire transfer away.</span>
          </h2>

          <div className="mt-6 flex items-baseline gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
              €
            </span>
            <span className="text-[44px] font-medium leading-none tracking-[-0.03em] text-fg sm:text-5xl">
              {price}
            </span>
            <span className="text-sm text-muted">/ space</span>
          </div>
          <p className="mt-3 text-[13.5px] leading-[1.55] text-muted">
            Your spot is assigned the moment the wire lands.
          </p>
        </div>

        <div className="border-t border-hairline px-7 py-6 sm:px-9 sm:py-7">
          <SpaceCounter spots={spots} compact />
        </div>

        <div className="border-t border-hairline bg-surface-2/60 px-7 py-6 sm:px-9 sm:py-7">
          <ReserveDialog spotsAvailable={spotsAvailable} price={price} />
          <p className="mt-4 text-center text-[11px] leading-[1.55] text-muted">
            No forms up front. The wire is the confirmation.
          </p>
        </div>
      </aside>
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

