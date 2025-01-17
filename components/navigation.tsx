"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useState } from "react";
import { useMedia } from "react-use";
import { cn } from "@/lib/utils";

import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Menu } from "lucide-react";

const routes = [
  { href: "/", label: "Home" },
  {
    href: "/transactions",
    label: "Transactions",
  },
  {
    href: "/accounts",
    label: "Accounts",
  },
  {
    href: "/categories",
    label: "Categories",
  },
  {
    href: "/settings",
    label: "Settings",
  },
];
export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useMedia("(max-width: 1024px)", false);

  const onClick = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Button
            variant={"outline"}
            size={"sm"}
            className="font-normal bg-white/10 text-white hover:bg-white/20 hover:text-white border-none"
          >
            <Menu className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="px-2">
          <SheetHeader>
            <SheetTitle>Choose Option</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-y-2 pt-8">
            {routes.map((route) => {
              return (
                <Button
                  key={route.href}
                  variant={route.href == pathname ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => onClick(route.href)}
                >
                  {route.label}
                </Button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    );
  }
  return (
    <nav className="hidden lg:flex items-center gap-x-2 overflow-x-auto">
      {routes.map((route) => {
        return (
          <Link href={route.href}>
            <Button
              key={route.href}
              variant="ghost"
              className={cn(
                "w-full lg:w-auto justify-between font-medium text-white border-none hover:bg-white/10 hover:text-white",
                pathname == route.href ? "bg-white/40" : "bg-transparent"
              )}
            >
              {route.label}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}
