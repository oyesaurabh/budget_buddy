import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { axiosService } from "@/services";
import { useConfirm } from "@/hooks/useConfirm";

export default function LogoutButton() {
  const router = useRouter();
  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to logout."
  );

  const handleLogout = async () => {
    try {
      const response = await axiosService.logout();
      const { status, message } = response ?? {};
      if (!status) throw new Error(message);

      toast.success(message || "Logout Successful");
      router.push("/authenticate");
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
      console.error(error);
    }
  };
  return (
    <>
      <ConfirmationDialog />
      <Avatar
        onClick={async () => {
          const ok = await confirm();
          if (!ok) return;
          handleLogout();
        }}
      >
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
    </>
  );
}
