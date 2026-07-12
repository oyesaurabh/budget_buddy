import Image from "next/image";
import Link from "next/link";
import {
  FiCheckCircle,
  FiGithub,
  FiTarget,
  FiTrendingUp,
} from "react-icons/fi";

import DashboardPreview from "./dashboard-preview";
import MarketingHeader from "./marketing-header";

const benefits = [
  {
    icon: FiCheckCircle,
    text: "See where your money goes in seconds.",
  },
  {
    icon: FiTrendingUp,
    text: "Spot patterns that help you save more.",
  },
  {
    icon: FiTarget,
    text: "Stay on track with goals that fit your life.",
  },
];

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Transactions", href: "/transactions" },
      { label: "Accounts", href: "/accounts" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "GitHub", href: "https://github.com/oyesaurabh/budget_buddy" },
      { label: "README", href: "https://github.com/oyesaurabh/budget_buddy#readme" },
      { label: "Contribute", href: "https://github.com/oyesaurabh/budget_buddy/pulls" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#privacy" },
      { label: "Security", href: "https://github.com/oyesaurabh/budget_buddy#-security" },
    ],
  },
];

export default function MarketingHome({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const startHref = isAuthenticated ? "/dashboard" : "/authenticate?tab=signup";

  return (
    <div className="min-h-screen overflow-x-clip bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <MarketingHeader isAuthenticated={isAuthenticated} />

      <main>
        <section className="relative bg-[radial-gradient(circle_at_12%_10%,#1674f8_0,#0759df_45%,#073db9_100%)] pb-40 pt-16 sm:pt-20 lg:pb-44 lg:pt-20">
          <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-14">
            <div className="relative z-10 max-w-xl">
              <h1 className="text-balance text-5xl font-bold leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-[64px]">
                Money feels lighter when it makes sense.
              </h1>
              <p className="mt-7 max-w-lg text-base leading-7 text-blue-50/90 sm:text-lg">
                One simple place to track spending, see patterns, and stay close
                to your goals.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={startHref}
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-7 text-sm font-semibold text-blue-700 shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
                >
                  {isAuthenticated ? "Go to dashboard" : "Start for free"}
                </Link>
                <Link
                  href="https://github.com/oyesaurabh/budget_buddy"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/70 px-7 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <FiGithub className="size-4" aria-hidden="true" />
                  View on GitHub
                </Link>
              </div>
            </div>

            <div className="relative min-h-[340px] lg:min-h-[440px]">
              <Image
                src="/assets/budget-flow.png"
                alt="Income, expenses, and savings flowing into a clear Budget Buddy overview"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </section>

        <section
          id="features"
          className="relative z-10 -mt-28 bg-[#07101c] px-5 pb-20 sm:px-8 lg:-mt-36 lg:px-10 lg:pb-28"
        >
          <DashboardPreview />
          <div className="mx-auto max-w-[1180px] pt-24 text-white sm:pt-28">
            <h2 className="text-center text-3xl font-bold tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              Clarity today. Progress tomorrow.
            </h2>
            <div
              id="how-it-works"
              className="mt-14 grid gap-8 md:grid-cols-3 md:divide-x md:divide-white/15"
            >
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={benefit.text}
                    className="flex items-center gap-5 md:px-8 first:md:pl-0 last:md:pr-0"
                  >
                    <div className="grid size-12 shrink-0 place-items-center rounded-full border-2 border-blue-500 text-blue-400">
                      <Icon className="size-6" aria-hidden="true" />
                    </div>
                    <p className="max-w-[220px] text-sm leading-6 text-slate-300">
                      {benefit.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-blue-400/20 bg-[#030b15] text-white">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid border-x border-blue-400/20 md:grid-cols-2 lg:grid-cols-[repeat(3,0.8fr)_1.2fr]">
            {footerLinks.map((group) => (
              <div
                key={group.title}
                className="border-b border-blue-400/20 p-8 sm:p-10 lg:border-b-0 lg:border-r"
              >
                <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-blue-400">
                  {group.title}
                </h3>
                <ul className="mt-7 space-y-4">
                  {group.links.map((link) => {
                    const protectedHref =
                      !isAuthenticated &&
                      ["/dashboard", "/transactions", "/accounts"].includes(link.href)
                        ? "/authenticate"
                        : link.href;
                    const external = protectedHref.startsWith("http");
                    return (
                      <li key={link.label}>
                        <Link
                          href={protectedHref}
                          target={external ? "_blank" : undefined}
                          rel={external ? "noreferrer" : undefined}
                          className="text-sm text-slate-300 transition-colors hover:text-white"
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            <div className="flex flex-col justify-center border-b border-blue-400/20 p-8 sm:p-10 lg:border-b-0">
              <h3 className="max-w-xs text-2xl font-bold leading-tight tracking-[-0.04em]">
                Ready to understand your money?
              </h3>
              <Link
                href={startHref}
                className="mt-8 inline-flex h-12 items-center justify-center rounded-lg bg-blue-600 px-7 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
              >
                {isAuthenticated ? "Open dashboard" : "Start for free"}
              </Link>
            </div>
          </div>

          <div className="overflow-hidden border-x border-t border-blue-400/20 px-6 pt-7 sm:px-10">
            <div className="select-none whitespace-nowrap text-[18vw] font-bold leading-[0.72] tracking-[-0.075em] text-blue-900/40 sm:text-[15vw] lg:text-[13vw]">
              Budget Buddy
            </div>
            <div className="relative z-10 flex flex-col gap-4 border-t border-blue-400/20 py-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <Image src="/logo-blue.svg" alt="" width={28} height={29} />
                <span>
                  Built by Saurabh Yadav ·{" "}
                  <Link
                    href="https://github.com/oyesaurabh/budget_buddy"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Open source
                  </Link>
                </span>
              </div>
              <p id="privacy" className="text-xs text-slate-500">
                Your data stays tied to your secure account.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
