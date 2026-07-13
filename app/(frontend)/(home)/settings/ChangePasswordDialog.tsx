"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { axiosService } from "@/services";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type Step = "password" | "otp";

export default function ChangePasswordDialog({ open, onOpenChange }: Props) {
  const [step, setStep] = useState<Step>("password");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset the dialog whenever it closes
  useEffect(() => {
    if (!open) {
      setStep("password");
      setNewPassword("");
      setConfirm("");
      setOtp("");
      setLoading(false);
    }
  }, [open]);

  const validPassword =
    newPassword.length >= 6 &&
    /[a-zA-Z]/.test(newPassword) &&
    /[0-9]/.test(newPassword);

  const requestOtp = async () => {
    if (!validPassword) {
      toast.error("Password needs 6+ characters, a letter and a number");
      return;
    }
    if (newPassword !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      const { status, message } = await axiosService.requestPasswordOtp();
      if (!status) throw new Error(message ?? "Failed to send code");
      toast.success(message ?? "Verification code sent");
      setStep("otp");
    } catch (error: any) {
      toast.error(error?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const verifyAndChange = async () => {
    if (otp.trim().length !== 6) {
      toast.error("Enter the 6-digit code");
      return;
    }
    try {
      setLoading(true);
      const { status, message } = await axiosService.changePassword({
        otp: otp.trim(),
        newPassword,
      });
      if (!status) throw new Error(message ?? "Failed to change password");
      toast.success(message ?? "Password changed");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>
            {step === "password"
              ? "Set a new password. We'll email you a code to confirm it's you."
              : "Enter the 6-digit code we just emailed you."}
          </DialogDescription>
        </DialogHeader>

        {step === "password" ? (
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                New password
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Confirm new password
              </label>
              <Input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter password"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Verification code
              </label>
              <Input
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="6-digit code"
                className="tracking-[0.4em]"
              />
            </div>
            <button
              type="button"
              onClick={requestOtp}
              disabled={loading}
              className="text-xs font-medium text-blue-600 hover:underline disabled:opacity-50 dark:text-blue-400"
            >
              Didn&apos;t get it? Resend code
            </button>
          </div>
        )}

        <DialogFooter>
          {step === "password" ? (
            <Button onClick={requestOtp} disabled={loading}>
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Send code"
              )}
            </Button>
          ) : (
            <Button onClick={verifyAndChange} disabled={loading}>
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Verify & change"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
