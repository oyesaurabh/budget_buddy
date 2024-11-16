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

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/auth/logout");
      const { message } = response.data ?? {};
      toast.success(message || "Logout Successful");
      setTimeout(() => {
        window.location.href = "/authenticate";
      }, 2000);
    } catch (error: any) {
      const message = error?.response?.data?.message || "Something went wrong";
      toast.error(message);
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
            <p onClick={() => handleLogout()}>Logout</p>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
