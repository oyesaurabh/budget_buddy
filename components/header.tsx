"use client";
import { HeaderLogo } from "./header-logo";
import Navigation from "./navigation";
import WelcomeMessage from "./welcome-msg";
import { DarkmodeToggle } from "./darkmode-toggle";
import LogoutButton from "./logout-btn";
import UseDateRangePicker from "./date-range-picker";

export default function Header() {
  return (
    <>
      <header className="bg-gradient-to-b from-blue-600 to-blue-500 dark:bg-gradient-to-b dark:from-blue-700 dark:to-blue-800 px-4 py-8 lg:px-14 pb-36">
        <div className="max-w-screen-2xl mx-auto">
          <div className="w-full flex items-center justify-between mb-14">
            <div className="flex items-center lg:gap-x-16">
              <HeaderLogo />
              <Navigation />
            </div>
            <div>
              <div className="flex gap-2">
                <UseDateRangePicker />
                <DarkmodeToggle />
                <LogoutButton />
              </div>
            </div>
          </div>
          <WelcomeMessage />
        </div>
      </header>
    </>
  );
}
