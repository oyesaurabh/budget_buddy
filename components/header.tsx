import { Loader2 } from "lucide-react";

import { HeaderLogo } from "./header-logo";
import Navigation from "./navigation";
import WelcomeMessage from "./welcome-msg";

export default function Header() {
  return (
    <header className="bg-gradient-to-b from-blue-600 to-blue-500 px-4 py-8 lg:px-14 pb-36">
      <div className="max-w-screen-2xl mx-auto">
        <div className="w-full flex items-center justify-between mb-14">
          <div className="flex items-center lg:gap-x-16">
            <HeaderLogo />
            <Navigation />
          </div>
          <div>
            <Loader2 className="size-8 animate-spin text-slate-400" />
          </div>
        </div>
        <WelcomeMessage />
      </div>
    </header>
  );
}
