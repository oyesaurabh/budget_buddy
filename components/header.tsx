"use client";
import { HeaderLogo } from "./header-logo";
import Navigation from "./navigation";
import WelcomeMessage from "./welcome-msg";
import { DarkmodeToggle } from "./darkmode-toggle";
import LogoutButton from "./logout-btn";
import { useAccountStore } from "@/hooks/useAccountsHook";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
export default function Header() {
  const {
    error,
    accounts,
    isAccountLoading,
    currentAccount,
    setCurrentAccount,
  } = useAccountStore();

  //this will handle account change from select dropdown
  const handleAccountChange = (value: any) => {
    const selectedAccount = accounts.find((acc) => acc.id === value);
    if (selectedAccount) {
      setCurrentAccount(selectedAccount);
    }
  };
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
                <DarkmodeToggle />
                <LogoutButton />
              </div>
            </div>
          </div>
          <WelcomeMessage />
          {isAccountLoading ? (
            <Select>
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </Select>
          ) : (
            <Select
              disabled={!!error}
              value={currentAccount?.id || ""}
              onValueChange={handleAccountChange}
            >
              <SelectTrigger className="w-[150px]">
                {currentAccount ? currentAccount.name : "Select an account"}
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id || ""}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </header>
    </>
  );
}
