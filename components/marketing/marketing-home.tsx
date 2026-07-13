import Link from "next/link";
import {
  FiArrowRight,
  FiBarChart2,
  FiCheck,
  FiCreditCard,
  FiGithub,
  FiLayers,
  FiLock,
  FiPieChart,
  FiShield,
  FiTag,
  FiTrendingUp,
  FiUpload,
} from "react-icons/fi";

import DashboardPreview from "./dashboard-preview";
import MarketingHeader from "./marketing-header";
import Reveal from "./reveal";

const stats = [
  { value: "6+", label: "Chart types" },
  { value: "CSV", label: "Bulk import" },
  { value: "Multi", label: "Account support" },
  { value: "100%", label: "Open source" },
];

const steps = [
  {
    number: "01",
    title: "Create your account",
    text: "Sign up for free in seconds — no card, no clutter.",
  },
  {
    number: "02",
    title: "Add or import money moves",
    text: "Enter transactions manually or import a CSV from your bank.",
  },
  {
    number: "03",
    title: "Watch the insights appear",
    text: "Dashboards and budgets update instantly, so you always know where you stand.",
  },
];

export default function MarketingHome({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const startHref = isAuthenticated ? "/dashboard" : "/authenticate?tab=signup";
  const primaryLabel = isAuthenticated ? "Go to dashboard" : "Start for free";

  return (
    <div className="min-h-screen overflow-x-clip bg-white text-slate-900 dark:bg-slate-950 dark:text-white">
      <MarketingHeader isAuthenticated={isAuthenticated} />

      <main>
        {/* ------------------------------- Hero ------------------------------- */}
        <section className="relative isolate overflow-hidden">
          {/* background layers */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(47,120,255,0.20),transparent_70%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 top-40 -z-10 size-72 rounded-full bg-blue-500/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 top-24 -z-10 size-72 rounded-full bg-emerald-500/10 blur-3xl"
          />

          <div className="mx-auto max-w-5xl px-5 pb-10 pt-16 text-center sm:px-8 sm:pt-24">
            <div className="animate-fade-up">
              <Link
                href="https://github.com/oyesaurabh/budget_buddy"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-4 py-1.5 text-xs font-medium text-slate-600 backdrop-blur transition-colors hover:border-blue-300 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-blue-300"
              >
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-blue-500" />
                </span>
                Open source personal finance
              </Link>
            </div>

            <h1
              className="mt-6 text-balance text-4xl font-bold leading-[1.03] tracking-tight animate-fade-up sm:text-6xl lg:text-7xl"
              style={{ animationDelay: "80ms" }}
            >
              Understand your money,{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-300">
                without the spreadsheets.
              </span>
            </h1>

            <p
              className="mx-auto mt-6 max-w-xl text-pretty text-base leading-7 text-slate-600 animate-fade-up dark:text-slate-300 sm:text-lg"
              style={{ animationDelay: "160ms" }}
            >
              Budget Buddy brings your income, spending, budgets and savings into
              one clear dashboard — so you can make calmer money decisions every
              day.
            </p>

            <div
              className="mt-9 flex flex-col items-center justify-center gap-3 animate-fade-up sm:flex-row"
              style={{ animationDelay: "240ms" }}
            >
              <Link
                href={startHref}
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-7 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-blue-600/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:ring-offset-slate-950 sm:w-auto"
              >
                {primaryLabel}
                <FiArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="https://github.com/oyesaurabh/budget_buddy"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white/60 px-7 text-sm font-semibold text-slate-700 backdrop-blur transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 sm:w-auto"
              >
                <FiGithub className="size-4" />
                View on GitHub
              </Link>
            </div>

            <p
              className="mt-4 text-xs text-slate-500 animate-fade-up dark:text-slate-400"
              style={{ animationDelay: "300ms" }}
            >
              Free &amp; open source · No credit card required
            </p>
          </div>

          {/* Product preview with floating accents */}
          <div className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-24">
            <Reveal delay={120} className="relative">
              {/* floating pills */}
              <div className="absolute -left-3 top-10 z-10 hidden animate-float rounded-xl border border-slate-200 bg-white/90 px-3 py-2 shadow-xl backdrop-blur dark:border-white/10 dark:bg-slate-800/90 md:block">
                <div className="flex items-center gap-2">
                  <span className="grid size-7 place-items-center rounded-lg bg-emerald-500/15 text-emerald-500">
                    <FiTrendingUp className="size-4" />
                  </span>
                  <div className="text-left">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Salary credited
                    </p>
                    <p className="text-xs font-semibold text-emerald-500">
                      +₹56,365
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-3 bottom-16 z-10 hidden animate-float-slow rounded-xl border border-slate-200 bg-white/90 px-3 py-2 shadow-xl backdrop-blur dark:border-white/10 dark:bg-slate-800/90 md:block">
                <div className="flex items-center gap-2">
                  <span className="grid size-7 place-items-center rounded-lg bg-blue-500/15 text-blue-500">
                    <FiPieChart className="size-4" />
                  </span>
                  <div className="text-left">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Budget used
                    </p>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">
                      82% · on track
                    </p>
                  </div>
                </div>
              </div>

              <DashboardPreview />
            </Reveal>
          </div>

          {/* stats strip */}
          <div className="border-y border-slate-200 bg-slate-50/60 dark:border-white/10 dark:bg-white/[0.02]">
            <div className="mx-auto grid max-w-5xl grid-cols-2 gap-px px-5 sm:grid-cols-4 sm:px-8">
              {stats.map((s) => (
                <div key={s.label} className="px-4 py-6 text-center">
                  <p className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ----------------------------- Features (bento) --------------------- */}
        <section id="features" className="py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to stay on top
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
                Simple tools that turn raw transactions into decisions you can
                actually act on.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Dashboards — large tile with mini chart */}
              <Reveal className="sm:col-span-2">
                <div className="group h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-blue-300 dark:border-white/10 dark:bg-slate-900 dark:hover:border-blue-500/40 sm:p-8">
                  <div className="flex items-start justify-between gap-6">
                    <div className="max-w-sm">
                      <div className="grid size-11 place-items-center rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
                        <FiBarChart2 className="size-5" />
                      </div>
                      <h3 className="mt-5 text-lg font-semibold tracking-tight">
                        Visual dashboards
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        Income vs expense, category breakdowns, spending trends
                        and top payees — all charted automatically.
                      </p>
                    </div>
                    {/* mini bar chart */}
                    <div className="hidden items-end gap-1.5 sm:flex" aria-hidden="true">
                      {[40, 68, 52, 84, 60, 92, 74].map((h, i) => (
                        <span
                          key={i}
                          className="w-3 rounded-t bg-gradient-to-t from-blue-600/30 to-blue-500 transition-all duration-500 group-hover:opacity-90"
                          style={{ height: `${h}px` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Budgets — tile with progress bars */}
              <Reveal delay={80}>
                <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-blue-300 dark:border-white/10 dark:bg-slate-900 dark:hover:border-blue-500/40 sm:p-8">
                  <div className="grid size-11 place-items-center rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
                    <FiPieChart className="size-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">
                    Per-category budgets
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Set a monthly budget and watch actual spend against it.
                  </p>
                  <div className="mt-5 space-y-2.5" aria-hidden="true">
                    {[
                      { w: "70%", over: false },
                      { w: "45%", over: false },
                      { w: "100%", over: true },
                    ].map((b, i) => (
                      <div
                        key={i}
                        className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"
                      >
                        <div
                          className={`h-full rounded-full ${
                            b.over ? "bg-rose-500" : "bg-blue-600"
                          }`}
                          style={{ width: b.w }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Remaining feature tiles */}
              {[
                {
                  icon: FiUpload,
                  title: "Import via CSV",
                  text: "Bulk-import bank statements and let Budget Buddy sort them.",
                },
                {
                  icon: FiLayers,
                  title: "Multiple accounts",
                  text: "Keep bank accounts separate and switch in a single click.",
                },
                {
                  icon: FiTag,
                  title: "Custom categories",
                  text: "Organise spending your way and see where money really goes.",
                },
              ].map((f, i) => {
                const Icon = f.icon;
                return (
                  <Reveal key={f.title} delay={i * 80}>
                    <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-blue-300 dark:border-white/10 dark:bg-slate-900 dark:hover:border-blue-500/40">
                      <div className="grid size-11 place-items-center rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
                        <Icon className="size-5" />
                      </div>
                      <h3 className="mt-5 text-lg font-semibold tracking-tight">
                        {f.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {f.text}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* --------------------------- Budget highlight ----------------------- */}
        <section className="border-t border-slate-200 bg-slate-50/60 py-20 dark:border-white/10 dark:bg-white/[0.02] sm:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-600/10 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                <FiShield className="size-3.5" />
                Stay in control
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Set budgets, spend with intention.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
                Give any category a monthly budget and Budget Buddy tracks it for
                you — a calm progress bar while you&apos;re on track, a clear red
                flag the moment you go over.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Live budget-vs-actual for every category",
                  "Timezone-aware, so your months line up with your bank",
                  "Balances update automatically as you add transactions",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-500">
                      <FiCheck className="size-3.5" />
                    </span>
                    <span className="text-slate-700 dark:text-slate-200">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href={startHref}
                className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                {primaryLabel}
                <FiArrowRight className="size-4" />
              </Link>
            </Reveal>

            {/* budget card visual */}
            <Reveal delay={120}>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-white/10 dark:bg-slate-900 sm:p-8">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Budget vs Actual</p>
                  <span className="text-xs text-slate-400">This month</span>
                </div>
                <div className="mt-6 space-y-5">
                  {[
                    { name: "Home", spent: "₹45,000", of: "₹50,000", w: "90%", over: false },
                    { name: "Food", spent: "₹12,400", of: "₹15,000", w: "83%", over: false },
                    { name: "Gym", spent: "₹6,800", of: "₹6,000", w: "100%", over: true },
                    { name: "Travel", spent: "₹3,200", of: "₹8,000", w: "40%", over: false },
                  ].map((b) => (
                    <div key={b.name}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="font-medium">{b.name}</span>
                        <span className="text-muted-foreground">
                          <span
                            className={
                              b.over
                                ? "font-semibold text-rose-500"
                                : "font-semibold text-slate-900 dark:text-white"
                            }
                          >
                            {b.spent}
                          </span>{" "}
                          / {b.of}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                        <div
                          className={`h-full rounded-full ${
                            b.over ? "bg-rose-500" : "bg-blue-600"
                          }`}
                          style={{ width: b.w }}
                        />
                      </div>
                      {b.over && (
                        <p className="mt-1 text-xs text-rose-500">
                          Over budget by ₹800
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ----------------------------- How it works ------------------------- */}
        <section id="how-it-works" className="py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Up and running in three steps
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
                No onboarding marathon. Get to insights in minutes.
              </p>
            </Reveal>

            <div className="relative mt-14 grid gap-8 md:grid-cols-3">
              {/* connector line */}
              <div
                aria-hidden="true"
                className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-white/10 md:block"
              />
              {steps.map((step, i) => (
                <Reveal key={step.number} delay={i * 100} className="relative">
                  <div className="grid size-12 place-items-center rounded-xl border border-slate-200 bg-white text-sm font-bold text-blue-600 shadow-sm dark:border-white/10 dark:bg-slate-900 dark:text-blue-400">
                    {step.number}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {step.text}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------- CTA ------------------------------- */}
        <section className="px-5 pb-24 sm:px-8">
          <Reveal className="mx-auto max-w-6xl">
            <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 px-6 py-14 text-center shadow-xl shadow-blue-900/20 sm:px-12 sm:py-16">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(40%_60%_at_50%_0%,rgba(255,255,255,0.25),transparent_70%)]"
              />
              <div className="mx-auto mb-6 grid size-12 place-items-center rounded-xl bg-white/15 text-white backdrop-blur">
                <FiLock className="size-5" />
              </div>
              <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to understand your money?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-blue-50/90">
                Start tracking today and see your first insights within minutes.
              </p>
              <Link
                href={startHref}
                className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-8 text-sm font-semibold text-blue-700 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
              >
                {primaryLabel}
                <FiArrowRight className="size-4" />
              </Link>
            </div>
          </Reveal>
        </section>
      </main>

      {/* ------------------------------- Footer ------------------------------- */}
      <footer className="border-t border-slate-200 dark:border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:px-8">
          <div className="flex items-center gap-2">
            <FiCreditCard className="size-4 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-slate-900 dark:text-white">
              Budget Buddy
            </span>
          </div>
          <p>
            Built by Saurabh Yadav ·{" "}
            <Link
              href="https://github.com/oyesaurabh/budget_buddy"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Open source
            </Link>
          </p>
          <p className="text-xs">Your data stays tied to your secure account.</p>
        </div>
      </footer>
    </div>
  );
}
