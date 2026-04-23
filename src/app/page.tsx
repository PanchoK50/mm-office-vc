import Image from "next/image";
import { OfficeRaisedTotal } from "@/components/OfficeRaisedTotal";
import { OfficeRecentDonations } from "@/components/OfficeRecentDonations";
import { ReserveDialog } from "@/components/ReserveDialog";
import { SpaceCounter, type Spot, type SpotStatus } from "@/components/SpaceCounter";
import { MobileStickyFooter } from "@/components/MobileStickyFooter";
import { FloatingPaths } from "@/components/ui/background-paths";
import {
  createOfficethonServerClient,
  createServerClient,
} from "@/lib/supabase/server";
import {
  BANK_DETAILS,
  HACK_NATION_POST_ID,
  JOINERS,
  PRICE_PER_SPACE,
  RECENT_WINS,
  SPACES_TOTAL,
} from "@/content/data";

export const revalidate = 30;

/* Officethon goal = KAUTION (15_536.01) + sum of room sponsorGoals
   (19_093.93 + 19_325.70 + 14_351.11 + 17_867.28 + 18_208.00).
   Mirrors FUNDRAISING_GOAL in the officethon repo. */
const OFFICE_FUNDRAISING_GOAL = 104_382.03;

async function getSpots(): Promise<Spot[]> {
  const supabase = createServerClient();

  const { data: spotRows, error: spotsErr } = await supabase
    .from("spots")
    .select("id, status, claim_id")
    .order("id");

  if (spotsErr) console.error("[getSpots] spots query failed:", spotsErr);

  if (!spotRows)
    return Array.from({ length: SPACES_TOTAL }, () => ({
      status: "open" as const,
      fundName: null,
    }));

  const claimIds = spotRows
    .map((s) => s.claim_id as string | null)
    .filter((id): id is string => !!id);

  let fundByClaimId = new Map<string, string | null>();
  if (claimIds.length > 0) {
    const { data: claimRows, error: claimsErr } = await supabase
      .from("claims")
      .select("id, fund_name")
      .in("id", claimIds);

    if (claimsErr) console.error("[getSpots] claims query failed:", claimsErr);

    fundByClaimId = new Map(
      (claimRows ?? []).map((c) => [
        c.id as string,
        (c.fund_name as string | null) ?? null,
      ]),
    );
  }

  return spotRows.map((s) => ({
    status: s.status as SpotStatus,
    fundName: s.claim_id ? fundByClaimId.get(s.claim_id as string) ?? null : null,
  }));
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
  return { total, recent: list.slice(0, 3) };
}

export default async function Home() {
  const [spots, office] = await Promise.all([getSpots(), getOfficeDonations()]);
  const spotsAvailable = spots.filter((s) => s.status === "open").length;

  const price = PRICE_PER_SPACE.toLocaleString("de-DE");

  const benefits = [
    {
      title: "Brand one of our Incubation Rooms",
      body: (
        <>A dedicated room named after your fund for twelve months, where our top startups build every day.</>
      ),
    },
    {
      title: "Jury at our Demo Day.",
      body: (
        <>You will be part of the jury at our Demo Day, where our top startups pitch.</>
      ),
    },
    {
      title: "Jury at Hackathon.",
      body: (
        <>
          You will be part of the jury at our Hackathon.{" "}
          <a
            href={`https://www.linkedin.com/feed/update/urn:li:activity:${HACK_NATION_POST_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black underline decoration-black/30 underline-offset-4 transition hover:text-accent hover:decoration-accent"
          >
            See our last hackathon ↗
          </a>
        </>
      ),
    },
    {
      title: "Fixed spot in our curriculum.",
      body: <>You will meet every new MM scholar at least once.</>,
    },
  ];

  return (
    <>
      {/* ——— Nav ——— */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-bg lg:pr-[440px]">
        <div className="px-6">
          <div className="mx-auto flex h-20 w-full max-w-5xl items-center justify-between">
            <a
              href="#top"
              className="flex items-center gap-3 text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded"
              aria-label="Manage and More Office"
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
                <span className="text-accent">·</span>&nbsp;Office
              </span>
            </a>
          </div>
        </div>
      </header>

      <main id="top" className="relative flex flex-col pb-20 lg:pb-0 lg:pr-[440px]">
        {/* ——— Hero ——— */}
        <section className="relative isolate flex min-h-screen flex-col justify-center overflow-hidden lg:overflow-visible px-6 pb-28 pt-32 sm:pt-36 lg:pt-40 grain">
          <div
            className="mesh absolute inset-y-0 left-0 right-0 lg:right-[-440px] -z-10"
            aria-hidden="true"
          />
          <div
            className="absolute inset-y-0 left-0 right-0 lg:right-[-440px] -z-10 rotate-180 opacity-60"
            aria-hidden="true"
          >
            <FloatingPaths position={1} />
            <FloatingPaths position={-1} />
          </div>
          <div className="mx-auto w-full max-w-5xl">
            
            <h1 className="fade-up-slow mt-8 text-balance text-[clamp(2.75rem,8.5vw,6.75rem)] font-medium leading-[0.95] tracking-[-0.03em] text-fg">
              The <span className="text-accent">hottest place</span> to be
              <br className="hidden sm:block" />{" "}
              <span className="text-muted">in the next years</span> to come.
            </h1>
            
            <p className="fade-up-slower mt-8 max-w-[54ch] text-balance text-lg leading-[1.55] text-muted sm:text-xl">
             This is your chance to be part of it.</p>
            <div className="fade-up-slower mt-12 flex flex-col gap-3 sm:flex-row sm:items-center">
            </div>
          </div>
        </section>

        {/* ——— Reserve side panel (hovering on lg+, inline on mobile) ——— */}
        <aside
          id="reserve"
          aria-label="Secure your access"
          className="reserve-panel scroll-mt-24 mx-6 mb-20 mt-4 overflow-hidden rounded-2xl border border-hairline-strong bg-white shadow-[0_24px_70px_-24px_rgba(0,0,0,0.45)] lg:mb-0 lg:mt-0"
        >
          <div className="relative px-7 pb-6 pt-4 sm:px-9 sm:pb-7 sm:pt-5">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
            />
            <h2 className="text-balance text-[26px] font-medium leading-[1.1] tracking-[-0.02em] text-fg sm:text-[28px]">
              {spotsWord(spotsAvailable)} {spotsAvailable === 1 ? "ticket" : "tickets"} left.{" "}
              <span className="text-muted">
                <br />
                {spotsWord(spotsAvailable)} {spotsAvailable === 1 ? "Gateway" : "Gateways"} to our Community.
              </span>
            </h2>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                €
              </span>
              <span className="text-[44px] font-medium leading-none tracking-[-0.03em] text-fg sm:text-5xl">
                {price}
              </span>
              <span className="text-sm text-muted">/ year</span>
            </div>
        
          </div>

          <div className="border-t border-hairline px-7 py-6 sm:px-9 sm:py-7">
            <SpaceCounter spots={spots} compact />
          </div>

          <div className="px-7 pb-6 sm:px-9 sm:pb-7">
            <ReserveDialog spotsAvailable={spotsAvailable} price={price} />
          </div>

          {/* ——— Officethon module ——— */}
          <div className="border-t-4 border-hairline-strong px-7 pt-6 sm:px-9 sm:pt-7">
            <p className="text-lg font-semibold tracking-tight text-fg">
              Our Office Fundraising:
            </p>
          </div>
          <div className="px-7 pb-6 sm:px-9 sm:pb-7">
            <OfficeRaisedTotal
              totalRaised={office.total}
              totalGoal={OFFICE_FUNDRAISING_GOAL}
            />
          </div>

          {office.recent.length > 0 ? (
            <div className="border-t border-hairline bg-surface-2/40 px-7 py-6 sm:px-9 sm:py-7">
              <OfficeRecentDonations donations={office.recent} />
            </div>
          ) : null}

          <div className="border-t border-hairline px-7 py-6 sm:px-9 sm:py-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
              Bank details
            </p>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-[11px] uppercase tracking-[0.14em] text-muted">
                  Account holder
                </dt>
                <dd className="mt-1 text-fg">{BANK_DETAILS.accountHolder}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.14em] text-muted">
                  IBAN
                </dt>
                <dd className="mt-1 font-mono text-fg">{BANK_DETAILS.iban}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.14em] text-muted">
                  BIC
                </dt>
                <dd className="mt-1 font-mono text-fg">{BANK_DETAILS.bic}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.14em] text-muted">
                  Reference
                </dt>
                <dd className="mt-1 text-fg">{BANK_DETAILS.reference}</dd>
              </div>
            </dl>
          </div>
        </aside>

        {/* ——— What you get ——— */}
        <section className="px-6 py-28 sm:py-36">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 max-w-3xl">
              <h2 className="mt-4 text-balance text-4xl font-medium leading-[1.05] tracking-[-0.02em] sm:text-5xl">
                We&rsquo;re building a space{" "}
                <span className="text-muted">for our best startups.</span>
              </h2>
              <p className="mt-6 text-lg leading-[1.55] text-muted">
                Manage and More is opening an office, and our best startups will move in. Office space in Munich&rsquo;s best location, free for
                the best teams, so they can accelerate without the overhead.
              </p>
              <p className="mt-6 text-lg leading-[1.55] text-muted">
                <a
                  href="https://officethon.mm-app.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fg underline decoration-hairline-strong underline-offset-4 transition hover:text-accent hover:decoration-accent"
                >
                  Learn more about the Officethon ↗
                </a>
              </p>

              <p className="mt-60 text-balance text-2xl font-medium leading-[1.3] tracking-[-0.01em] text-fg sm:text-3xl">
                <span className="text-accent">You</span> will be branding a Room.{" "}
                <span className="text-accent">One of Four</span> spaces. First Come First Serve.
              </p>
            </div>

            <div className="benefits-halo relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-10 -inset-y-16 -z-10 bg-[radial-gradient(50%_60%_at_20%_20%,rgba(0,162,204,0.18)_0%,transparent_70%),radial-gradient(45%_55%_at_85%_80%,rgba(0,162,204,0.14)_0%,transparent_70%)] blur-2xl"
              />
              <ul className="grid gap-6 md:grid-cols-2">
                {benefits.map((b) => (
                  <li
                    key={b.title}
                    className="benefit-card group relative overflow-hidden rounded-3xl p-[1.5px] shadow-[0_30px_90px_-30px_rgba(0,162,204,0.55),0_0_60px_-10px_rgba(255,255,255,0.35),0_0_0_1px_rgba(255,255,255,0.08)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_40px_120px_-24px_rgba(0,162,204,0.8),0_0_90px_-10px_rgba(255,255,255,0.55),0_0_0_1px_rgba(255,255,255,0.18)]"
                  >
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 rounded-3xl bg-[conic-gradient(from_140deg_at_50%_50%,rgba(0,162,204,0.65),rgba(255,255,255,0.9)_25%,rgba(0,162,204,0.45)_55%,rgba(255,255,255,0.9)_80%,rgba(0,162,204,0.65))] opacity-80 transition duration-500 group-hover:opacity-100"
                    />
                    <div className="relative flex h-full flex-col rounded-[calc(1.5rem-1.5px)] bg-white px-8 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-x-10 -top-24 h-40 bg-[radial-gradient(closest-side,rgba(0,162,204,0.22),transparent_70%)] opacity-0 transition duration-500 group-hover:opacity-100"
                      />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(0,162,204,0.55),transparent)]"
                      />
                      <h3 className="relative text-[26px] font-medium leading-[1.15] tracking-[-0.015em] text-black sm:text-[30px]">
                        {b.title}
                      </h3>
                      <div
                        aria-hidden="true"
                        className="relative mt-6 h-px w-10 bg-accent/60 transition-all duration-500 group-hover:w-16 group-hover:bg-accent"
                      />
                      <p className="relative mt-6 max-w-[38ch] text-[15px] leading-[1.65] text-black/65">
                        {b.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
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
                The Office,{" "}
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
                alt="Office floor plan"
                width={2229}
                height={1146}
                className="h-auto w-full rounded-xl"
              />
            </div>
          </div>
        </section>

        {/* ——— Vision ——— */}
        <section className="border-t border-hairline px-6 py-28 sm:py-36">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 max-w-3xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-accent">
                Vision
              </p>
              <h2 className="mt-4 text-balance text-4xl font-medium leading-[1.05] tracking-[-0.02em] sm:text-5xl">
                How it will look{" "}
                <span className="text-muted">once teams move in.</span>
              </h2>
            </div>

            <ul className="grid gap-6 sm:grid-cols-2">
              {[1, 2, 3, 4].map((n) => (
                <li
                  key={n}
                  className="overflow-hidden rounded-3xl border border-hairline bg-surface"
                >
                  <Image
                    src={`/Office${n}.png`}
                    alt={`Office vision ${n}`}
                    width={2390}
                    height={1792}
                    className="h-auto w-full"
                  />
                </li>
              ))}
            </ul>
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
            <div className="mb-16">
              <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-muted">
                Early Stage Founders
              </p>
              <h2 className="mt-4 max-w-2xl text-balance text-4xl font-medium leading-[1.05] tracking-[-0.02em] sm:text-5xl">
                The People that might move in.
              </h2>
            </div>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {JOINERS.map((j) => (
                <li
                  key={j.name}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-hairline bg-surface transition hover:border-hairline-strong"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    <Image
                      src={j.image}
                      alt={j.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute right-4 top-4 overflow-hidden rounded-lg shadow-lg">
                      <Image
                        src={j.logo}
                        alt={j.tag}
                        width={32}
                        height={32}
                        className="h-8 w-8 object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                      {j.tag}
                    </span>
                    <h3 className="text-xl font-medium tracking-tight text-fg">
                      {j.name}
                    </h3>
                    <p className="text-[14px] leading-[1.55] text-muted">
                      {j.line}
                    </p>
                    <div className="mt-auto pt-3">
                      <a
                        href={j.linkedin.kind === "profile" ? j.linkedin.url : `https://www.linkedin.com/feed/update/urn:li:activity:${j.linkedin.postId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-md border border-hairline px-4 py-2 text-xs font-medium tracking-wide text-fg transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                      >
                        View on LinkedIn
                        <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-12 max-w-2xl text-lg leading-[1.6] text-muted sm:text-xl">
              Active generations are already shipping.{" "}
              <a
                href="https://www.manageandmore.de/people/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg underline decoration-hairline-strong underline-offset-4 transition hover:text-accent hover:decoration-accent"
              >
                Meet them ↗
              </a>
            </p>
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

        {/* ——— Access pull-quote ——— */}
        <section className="px-6 py-28 sm:py-36">
          <div className="mx-auto w-full max-w-5xl">
            <blockquote className="text-balance text-[clamp(2rem,5.5vw,4.5rem)] font-medium leading-[1] tracking-[-0.03em] text-fg">
              It&apos;s your choice.
              <br className="hidden sm:block" />{" "}
              <span className="text-muted">Spend 7.5k on a sponsored dinner</span>
              <br className="hidden sm:block" />{" "}
              or gain access to <span className="text-accent">Munich&apos;s hottest</span> new startup space.
            </blockquote>
          </div>
        </section>

        {/* ——— Footer ——— */}
        <footer className="border-t border-hairline px-6 py-10">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <a
                href="mailto:felix.hadasch@manageandmore.de"
                className="hover:text-fg"
              >
                felix.hadasch@manageandmore.de
              </a>
              <a
                href="tel:+491608340629"
                className="hover:text-fg"
              >
                +49 160 8340629
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

      <MobileStickyFooter spotsAvailable={spotsAvailable} />
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

function spotsWord(n: number): string {
  const words = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  return words[n] ?? String(n);
}

function Dot() {
  return (
    <span
      aria-hidden="true"
      className="mt-[0.6em] inline-block h-1 w-1 shrink-0 rounded-full bg-accent"
    />
  );
}

