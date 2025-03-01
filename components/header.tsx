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
import { MdOutlineAccountBalance } from "react-icons/md";
import { formatCurrency } from "@/utils/math";
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
          <div className="flex flex-col items-center lg:items-start">
            <WelcomeMessage />
            {isAccountLoading ? (
              <Select>
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </Select>
            ) : (
              <div className="flex items-center gap-2 mt-2 justify-start">
                <MdOutlineAccountBalance
                  style={{ fontSize: "60px" }}
                  className="text-white"
                />
                <Select
                  disabled={!!error}
                  value={currentAccount?.id || ""}
                  onValueChange={handleAccountChange}
                >
                  <SelectTrigger className="max-w-[150px] h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition">
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

                <span className="font-serif max-w-[150px] h-9 pt-1 rounded-md px-3 bg-white/10 outline-none text-white">
                  {formatCurrency(currentAccount?.balance)}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
