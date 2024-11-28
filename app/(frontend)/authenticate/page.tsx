"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import logoSrc from "@/public/logo.svg";
import SignIn from "@/app/(frontend)/authenticate/SignIn";
import SignUp from "@/app/(frontend)/authenticate/SignUp";

const Page = () => {
  const [activeTab, setActiveTab] = useState("signin");
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 px-10 lg:px-0">
      <div className="flex justify-center mt-[25%] lg:mt-[15%]">
        <Tabs defaultValue="signin" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin" onClick={() => setActiveTab("signin")}>
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" onClick={() => setActiveTab("signup")}>
              Sign Up
            </TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab}>
            {activeTab === "signin" ? (
              <SignIn />
            ) : (
              <SignUp switchTab={() => setActiveTab("signin")} />
            )}
          </TabsContent>
        </Tabs>
      </div>
      <div className="h-full bg-blue-500 hidden lg:flex items-center justify-center dark:bg-blue-700">
        <Image src={logoSrc} height={100} width={100} alt="logo" priority />
      </div>
    </div>
  );
};
export default Page;
