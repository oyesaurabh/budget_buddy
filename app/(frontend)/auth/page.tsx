import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignIn from "@/app/(frontend)/auth/SignIn";
import SignUp from "@/app/(frontend)/auth/SignUp";

const Page = () => {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 px-10 lg:px-0">
      <div className="flex justify-center mt-[40%] lg:mt-[20%]">
        <Tabs defaultValue="signin" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="singup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <SignIn />
          </TabsContent>
          <TabsContent value="singup">
            <SignUp />
          </TabsContent>
        </Tabs>
      </div>
      <div className="h-full bg-blue-600 hidden lg:flex items-center justify-center">
        <Image src="/logo.svg" height={100} width={100} alt="logo" />
      </div>
    </div>
  );
};
export default Page;
