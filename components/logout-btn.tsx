import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { axiosService } from "@/services";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await axiosService.logout();
      const { status, message } = response ?? {};
      if (!status) throw new Error(message);

      toast.success(message || "Logout Successful");
      router.push("/authenticate");
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Avatar>
          <AvatarImage
            className="h-9 w-9 rounded-full cursor-pointer"
            src="https://github.com/shadcn.png"
            alt="usericon"
            title="Logout"
          />
          <AvatarFallback>
            <Loader2 className="h-9 w-9 animate-spin text-slate-400" />
          </AvatarFallback>
        </Avatar>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>
            <Button
              onClick={() => handleLogout()}
              disabled={loading}
              className="w-full"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Logout"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
