"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiCheck } from "react-icons/fi";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import logoWhite from "@/public/logo.svg";
import logoBlue from "@/public/logo-blue.svg";
import SignIn from "@/app/(frontend)/authenticate/SignIn";
import SignUp from "@/app/(frontend)/authenticate/SignUp";

const benefits = [
  "Track income, expenses and budgets in one place",
  "Import bank statements with a single CSV",
  "Beautiful charts that update in real time",
];

function AuthTabs() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") === "signup" ? "signup" : "signin"
  );
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="signin" className="mt-6">
        <SignIn />
      </TabsContent>
      <TabsContent value="signup" className="mt-6">
        <SignUp switchTab={() => setActiveTab("signin")} />
      </TabsContent>
    </Tabs>
  );
}

const Page = () => {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Form panel */}
      <div className="flex items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md">
          {/* back link */}
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <FiArrowLeft className="size-4" />
            Back to home
          </Link>

          {/* mobile brand */}
          <div className="mb-6 flex items-center gap-2.5 lg:hidden">
            <Image src={logoBlue} height={30} width={30} alt="Budget Buddy" />
            <span className="text-lg font-bold tracking-tight">
              Budget Buddy
            </span>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">
              Welcome to Budget Buddy
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to your account or create a new one to get started.
            </p>
          </div>

          <Suspense>
            <AuthTabs />
          </Suspense>
        </div>
      </div>

      {/* Branding panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 lg:flex lg:flex-col lg:justify-between lg:p-12">
        {/* background texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:40px_40px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-10 size-72 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -left-10 size-72 rounded-full bg-blue-400/20 blur-3xl"
        />

        {/* logo */}
        <Link href="/" className="relative z-10 flex items-center gap-2.5">
          <Image src={logoWhite} height={34} width={34} alt="Budget Buddy" />
          <span className="text-lg font-bold tracking-tight text-white">
            Budget Buddy
          </span>
        </Link>

        {/* headline + benefits */}
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white">
            Take control of your money.
          </h1>
          <p className="mt-4 text-blue-50/90">
            The calm, open-source way to see where your money goes and stay on
            top of your budgets.
          </p>
          <ul className="mt-8 space-y-4">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 text-blue-50">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-white/20">
                  <FiCheck className="size-3" />
                </span>
                <span className="text-sm">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-blue-50/70">
          Built by Saurabh Yadav · Open source
        </p>
      </div>
    </div>
  );
};
export default Page;
