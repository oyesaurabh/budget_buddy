import Link from "next/link";
import {
  FiArrowRight,
  FiBarChart2,
  FiCreditCard,
  FiGithub,
  FiLayers,
  FiShield,
  FiTag,
  FiUpload,
} from "react-icons/fi";

import DashboardPreview from "./dashboard-preview";
import MarketingHeader from "./marketing-header";

const features = [
  {
    icon: FiBarChart2,
    title: "Visual dashboards",
    text: "Income vs expense, category breakdowns, spending trends and top payees — all charted automatically.",
  },
  {
    icon: FiCreditCard,
    title: "Track every transaction",
    text: "Log income and expenses with categories, notes and payees so nothing slips through.",
  },
  {
    icon: FiLayers,
    title: "Multiple accounts",
    text: "Keep your bank accounts separate and switch between them in a single click.",
  },
  {
    icon: FiUpload,
    title: "Import via CSV",
    text: "Bulk-import your bank statements and let Budget Buddy do the sorting.",
  },
  {
    icon: FiTag,
    title: "Custom categories",
    text: "Organise spending your way and finally see where the money really goes.",
  },
  {
    icon: FiShield,
    title: "Private & secure",
    text: "Session-based authentication keeps your data tied to your account alone.",
  },
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
    text: "Your dashboards update instantly so you always know where you stand.",
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
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white">
      <MarketingHeader isAuthenticated={isAuthenticated} />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          {/* soft glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(47,120,255,0.18),transparent_70%)]"
          />
          <div className="mx-auto max-w-5xl px-5 pb-16 pt-16 text-center sm:px-8 sm:pt-24">
            <Link
              href="https://github.com/oyesaurabh/budget_buddy"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-blue-300 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-blue-300"
            >
              <FiGithub className="size-3.5" aria-hidden="true" />
              Open source personal finance
            </Link>

            <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              Understand your money,{" "}
              <span className="text-blue-600 dark:text-blue-400">
                without the spreadsheets.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              Budget Buddy brings your income, spending and savings into one
              clear dashboard — so you can make calmer money decisions every day.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={startHref}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-7 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:ring-offset-slate-950 sm:w-auto"
              >
                {primaryLabel}
                <FiArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="https://github.com/oyesaurabh/budget_buddy"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-7 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-white/15 dark:text-white dark:hover:bg-white/5 sm:w-auto"
              >
                <FiGithub className="size-4" aria-hidden="true" />
                View on GitHub
              </Link>
            </div>

            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              Free &amp; open source · No credit card required
            </p>
          </div>

          {/* Product preview */}
          <div className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
            <DashboardPreview />
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="border-t border-slate-200 bg-slate-50/60 py-20 dark:border-white/10 dark:bg-white/[0.02] sm:py-24"
        >
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to stay on top
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
                Simple tools that turn raw transactions into decisions you can
                actually act on.
              </p>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-blue-300 dark:border-white/10 dark:bg-slate-900 dark:hover:border-blue-500/40"
                  >
                    <div className="grid size-11 place-items-center rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {feature.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Up and running in three steps
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
                No onboarding marathon. Get to insights in minutes.
              </p>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.number} className="relative">
                  <span className="text-4xl font-bold text-blue-600/25 dark:text-blue-400/25">
                    {step.number}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 pb-24 sm:px-8">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 px-6 py-14 text-center shadow-xl shadow-blue-900/20 sm:px-12 sm:py-16">
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
              <FiArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:px-8">
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
