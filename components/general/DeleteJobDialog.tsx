"use client";

import { useState } from "react";
import { toast } from "sonner";
import { unstable_rethrow } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function isRedirectError(error: unknown): boolean {
  const digest = (error as { digest?: string })?.digest;
  return typeof digest === "string" && digest.startsWith("NEXT_REDIRECT");
}

type DeleteJobDialogProps = {
  jobId: string;
  jobTitle?: string;
  deleteAction: (jobId: string) => Promise<void>;
  /** Optional: when not provided, dialog is controlled via open/onOpenChange only */
  trigger?: React.ReactNode;
  /** Controlled open state (use when dialog is opened from e.g. dropdown to avoid unmount) */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** For admin delete */
  isAdmin?: boolean;
};

export function DeleteJobDialog({
  jobId,
  jobTitle,
  deleteAction,
  trigger,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  isAdmin,
}: DeleteJobDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;

  const handleOpenChange = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChangeProp?.(next);
  };

  const handleConfirm = async () => {
    setPending(true);
    try {
      await deleteAction(jobId);
      handleOpenChange(false);
      toast.success(
        isAdmin ? "Job deleted from the board." : "Job deleted successfully."
      );
    } catch (error) {
      if (isRedirectError(error)) {
        toast.success(
          isAdmin ? "Job deleted from the board." : "Job deleted successfully."
        );
        unstable_rethrow(error);
      } else {
        setPending(false);
        toast.error("Failed to delete job. Please try again.");
      }
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      {trigger != null && (
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      )}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete job post?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete
            {jobTitle ? (
              <> the job &quot;{jobTitle}&quot;</>
            ) : (
              " this job post"
            )}
            {isAdmin ? " from the board." : " and remove it from the board."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => handleOpenChange(false)}
            disabled={pending}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            type="button"
            variant="destructive"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void handleConfirm();
            }}
            disabled={pending}
          >
            {pending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
