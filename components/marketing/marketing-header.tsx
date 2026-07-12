"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

import MarketingThemeToggle from "./theme-toggle";

const links = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "GitHub", href: "https://github.com/oyesaurabh/budget_buddy" },
];

export default function MarketingHeader({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const authHref = isAuthenticated ? "/dashboard" : "/authenticate";
  const authLabel = isAuthenticated ? "Dashboard" : "Log in";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur dark:border-white/10 dark:bg-slate-950/95">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-14">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Budget Buddy home"
        >
          <Image src="/logo-blue.svg" alt="" width={34} height={35} priority />
          <span className="text-lg font-bold tracking-[-0.03em] text-slate-950 dark:text-white sm:text-xl">
            Budget Buddy
          </span>
        </Link>

        <nav className="hidden items-center gap-10 text-sm font-medium text-slate-600 md:flex dark:text-slate-300">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
              className="rounded-sm transition-colors hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:text-blue-400"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <MarketingThemeToggle />
          <Link
            href={authHref}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:ring-offset-slate-950"
          >
            {authLabel}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="grid size-10 place-items-center rounded-lg border border-slate-200 text-slate-700 md:hidden dark:border-white/10 dark:text-white"
          aria-expanded={menuOpen}
          aria-controls="marketing-mobile-menu"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        >
          {menuOpen ? <FiX className="size-5" /> : <FiMenu className="size-5" />}
        </button>
      </div>

      {menuOpen && (
        <div
          id="marketing-mobile-menu"
          className="border-t border-slate-200 bg-white px-5 py-5 md:hidden dark:border-white/10 dark:bg-slate-950"
        >
          <nav className="mx-auto flex max-w-[1440px] flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex items-center gap-3 border-t border-slate-200 pt-4 dark:border-white/10">
              <MarketingThemeToggle />
              <Link
                href={authHref}
                onClick={() => setMenuOpen(false)}
                className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white"
              >
                {authLabel}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
