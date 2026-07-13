"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Calendar,
  CreditCard,
  Download,
  Github,
  Globe,
  IndianRupee,
  Info,
  Lock,
  LogOut,
  Mail,
  Palette,
  Shield,
  Trash2,
  Upload,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

/* ----------------------------- small building blocks ---------------------- */

type SettingRowProps = {
  icon: React.ReactNode;
  title: string;
  description?: string;
  control?: React.ReactNode;
};

const SettingRow = ({ icon, title, description, control }: SettingRowProps) => (
  <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
    <div className="flex items-start gap-3">
      <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
        {icon}
      </div>
      <div className="space-y-0.5">
        <p className="text-sm font-medium leading-none">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
    {control && <div className="shrink-0">{control}</div>}
  </div>
);

const SettingsSection = ({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-xl border bg-card p-4 sm:p-6">
    {title && (
      <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
        {title}
      </h3>
    )}
    <div className="divide-y">{children}</div>
  </div>
);

// Presentational toggle — flips local state only (no persistence yet)
const Toggle = ({ defaultOn = false }: { defaultOn?: boolean }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setOn((v) => !v)}
      className={cn(
        "relative h-6 w-11 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        on ? "bg-blue-600" : "bg-muted-foreground/30"
      )}
    >
      <span
        className={cn(
          "absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform",
          on && "translate-x-5"
        )}
      />
    </button>
  );
};

const tabs = [
  { value: "profile", label: "Profile", icon: User },
  { value: "preferences", label: "Preferences", icon: Palette },
  { value: "notifications", label: "Notifications", icon: Bell },
  { value: "data", label: "Data & Privacy", icon: Shield },
  { value: "about", label: "About", icon: Info },
];

/* --------------------------------- page ----------------------------------- */

const SettingsPage = () => {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(localStorage.getItem("username") || "");
  }, []);

  return (
    <div className="max-w-screen-2xl mx-auto -mt-24">
      <Card className="border-none">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Manage your profile, preferences and app options.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="profile"
            className="flex flex-col gap-6 md:flex-row"
          >
            {/* sidebar nav */}
            <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto bg-transparent p-0 md:w-56 md:flex-col md:overflow-visible">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="w-full justify-start gap-2 rounded-lg px-3 py-2 data-[state=active]:bg-muted data-[state=active]:shadow-none"
                  >
                    <Icon className="size-4" />
                    {tab.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* content */}
            <div className="flex-1 space-y-5">
              {/* Profile */}
              <TabsContent value="profile" className="mt-0 space-y-5">
                <SettingsSection>
                  <div className="flex flex-col gap-4 pb-4 sm:flex-row sm:items-center">
                    <div className="grid size-16 shrink-0 place-items-center rounded-full bg-blue-600 text-xl font-semibold text-white">
                      {(name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-semibold">
                        {name || "Your Name"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        oye.saurabhyadav@gmail.com
                      </p>
                    </div>
                    <Button variant="secondary">Change photo</Button>
                  </div>
                </SettingsSection>

                <SettingsSection title="Account details">
                  <div className="grid gap-4 py-4 first:pt-0 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        Full name
                      </label>
                      <Input defaultValue={name} placeholder="Your name" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        Email
                      </label>
                      <Input
                        defaultValue="oye.saurabhyadav@gmail.com"
                        disabled
                      />
                    </div>
                  </div>
                  <SettingRow
                    icon={<Lock className="size-4" />}
                    title="Password"
                    description="Change the password used to sign in."
                    control={<Button variant="outline">Change</Button>}
                  />
                </SettingsSection>

                <div className="flex justify-end">
                  <Button>Save changes</Button>
                </div>
              </TabsContent>

              {/* Preferences */}
              <TabsContent value="preferences" className="mt-0 space-y-5">
                <SettingsSection title="Appearance">
                  <SettingRow
                    icon={<Palette className="size-4" />}
                    title="Theme"
                    description="Choose how Budget Buddy looks to you."
                    control={
                      <Select defaultValue="system">
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="system">System</SelectItem>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                        </SelectContent>
                      </Select>
                    }
                  />
                </SettingsSection>

                <SettingsSection title="Regional">
                  <SettingRow
                    icon={<IndianRupee className="size-4" />}
                    title="Currency"
                    description="Used across all amounts and charts."
                    control={
                      <Select defaultValue="inr">
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inr">₹ INR</SelectItem>
                          <SelectItem value="usd">$ USD</SelectItem>
                          <SelectItem value="eur">€ EUR</SelectItem>
                        </SelectContent>
                      </Select>
                    }
                  />
                  <SettingRow
                    icon={<Calendar className="size-4" />}
                    title="Date format"
                    description="How dates are displayed."
                    control={
                      <Select defaultValue="dmy">
                        <SelectTrigger className="w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dmy">DD-MM-YYYY</SelectItem>
                          <SelectItem value="mdy">MM-DD-YYYY</SelectItem>
                          <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    }
                  />
                  <SettingRow
                    icon={<Globe className="size-4" />}
                    title="Timezone"
                    description="Used to group transactions by day."
                    control={
                      <Select defaultValue="ist">
                        <SelectTrigger className="w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ist">IST (UTC+5:30)</SelectItem>
                          <SelectItem value="utc">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                    }
                  />
                </SettingsSection>
              </TabsContent>

              {/* Notifications */}
              <TabsContent value="notifications" className="mt-0 space-y-5">
                <SettingsSection title="Email">
                  <SettingRow
                    icon={<Mail className="size-4" />}
                    title="Email notifications"
                    description="Receive account updates over email."
                    control={<Toggle defaultOn />}
                  />
                  <SettingRow
                    icon={<Calendar className="size-4" />}
                    title="Weekly summary"
                    description="A recap of your spending every Monday."
                    control={<Toggle />}
                  />
                </SettingsSection>

                <SettingsSection title="Alerts">
                  <SettingRow
                    icon={<Bell className="size-4" />}
                    title="Budget alerts"
                    description="Get notified when a category nears its budget."
                    control={<Toggle defaultOn />}
                  />
                  <SettingRow
                    icon={<CreditCard className="size-4" />}
                    title="Large transaction alerts"
                    description="Flag transactions above a set amount."
                    control={<Toggle />}
                  />
                </SettingsSection>
              </TabsContent>

              {/* Data & Privacy */}
              <TabsContent value="data" className="mt-0 space-y-5">
                <SettingsSection title="Your data">
                  <SettingRow
                    icon={<Download className="size-4" />}
                    title="Export data"
                    description="Download all your transactions as CSV."
                    control={<Button variant="outline">Export</Button>}
                  />
                  <SettingRow
                    icon={<Upload className="size-4" />}
                    title="Import transactions"
                    description="Bulk-import from a bank statement CSV."
                    control={<Button variant="outline">Import</Button>}
                  />
                </SettingsSection>

                <SettingsSection title="Danger zone">
                  <SettingRow
                    icon={<Trash2 className="size-4 text-rose-500" />}
                    title="Delete all transactions"
                    description="Permanently remove every transaction."
                    control={<Button variant="destructive">Delete</Button>}
                  />
                  <SettingRow
                    icon={<Trash2 className="size-4 text-rose-500" />}
                    title="Delete account"
                    description="Permanently delete your account and all data."
                    control={<Button variant="destructive">Delete</Button>}
                  />
                </SettingsSection>

                <div className="flex justify-end">
                  <Button variant="outline" className="gap-2">
                    <LogOut className="size-4" />
                    Log out
                  </Button>
                </div>
              </TabsContent>

              {/* About */}
              <TabsContent value="about" className="mt-0 space-y-5">
                <SettingsSection title="About">
                  <SettingRow
                    icon={<Info className="size-4" />}
                    title="Version"
                    description="Budget Buddy"
                    control={
                      <span className="text-sm text-muted-foreground">
                        v0.1.0
                      </span>
                    }
                  />
                  <SettingRow
                    icon={<Github className="size-4" />}
                    title="Source code"
                    description="Budget Buddy is open source."
                    control={
                      <a
                        href="https://github.com/oyesaurabh/budget_buddy"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button variant="outline">View on GitHub</Button>
                      </a>
                    }
                  />
                  <SettingRow
                    icon={<Shield className="size-4" />}
                    title="Privacy"
                    description="Your data stays tied to your secure account."
                  />
                </SettingsSection>
                <p className="text-center text-xs text-muted-foreground">
                  Built by Saurabh Yadav
                </p>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
