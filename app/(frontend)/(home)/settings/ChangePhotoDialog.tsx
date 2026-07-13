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
import { useProfileStore } from "@/hooks/useProfileHook";

const DEFAULT_AVATAR = "https://github.com/shadcn.png";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ChangePhotoDialog({ open, onOpenChange }: Props) {
  const { avatarUrl, setProfile } = useProfileStore();
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setUrl(avatarUrl ?? "");
  }, [open, avatarUrl]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const { status, data, message } = await axiosService.updateProfile({
        avatar_url: url.trim() || null,
      });
      if (!status) throw new Error(message ?? "Failed to update photo");
      setProfile({ avatarUrl: data?.avatar_url ?? null });
      toast.success("Profile photo updated");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.message ?? "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const preview = url.trim() || DEFAULT_AVATAR;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change profile photo</DialogTitle>
          <DialogDescription>
            Paste a public image URL to use as your profile picture.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4 py-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            className="size-16 shrink-0 rounded-full border object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
            }}
          />
          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Image URL
            </label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/photo.png"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {url.trim() && (
            <Button
              variant="ghost"
              onClick={() => setUrl("")}
              disabled={saving}
            >
              Remove
            </Button>
          )}
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
