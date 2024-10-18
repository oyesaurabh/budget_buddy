import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Image from "next/image";
const Page = () => {
  return (
    <>
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        <div className="flex justify-center items-center">
          <Button>SignUp</Button>
        </div>
        <div className="h-full bg-red-600 hidden lg:flex items-center justify-center">
          <Image src="/logo.svg" height={100} width={100} alt="logo" />
        </div>
      </div>
    </>
  );
};
export default Page;
