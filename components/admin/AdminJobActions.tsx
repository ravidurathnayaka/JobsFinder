"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { adminApproveJob, adminRejectJob } from "@/app/actions";
import Link from "next/link";
import {
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

type ActionState = "approve" | "reject" | null;

interface AdminJobActionsProps {
  jobId: string;
  status: string;
}

export function AdminJobActions({ jobId, status }: AdminJobActionsProps) {
  const [pendingAction, setPendingAction] = useState<ActionState>(null);
  const [isPending, startTransition] = useTransition();

  const handleAction = (action: Exclude<ActionState, null>) => {
    startTransition(async () => {
      try {
        setPendingAction(action);
        if (action === "approve") {
          await adminApproveJob(jobId);
          toast.success("Job approved");
        } else {
          await adminRejectJob(jobId);
          toast.success("Job rejected");
        }
      } catch (error) {
        toast.error("Action failed. Please try again.");
        console.error("Admin action failed", error);
      } finally {
        setPendingAction(null);
      }
    });
  };

  const isBusy = isPending || pendingAction !== null;
  const isApproved = status === "ACTIVE";
  const isRejected = status === "REJECTED";

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        size="sm"
        variant="secondary"
        className="h-8 gap-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
        disabled={isBusy || isApproved}
        onClick={() => handleAction("approve")}
      >
        <CheckCircle2 className="size-4" />
        <span className="hidden sm:inline">
          {pendingAction === "approve" ? "Approving..." : "Approve"}
        </span>
      </Button>
      <Button
        size="sm"
        variant="secondary"
        className="h-8 gap-1.5 text-destructive hover:bg-destructive/10"
        disabled={isBusy || isRejected}
        onClick={() => handleAction("reject")}
      >
        <XCircle className="size-4" />
        <span className="hidden sm:inline">
          {pendingAction === "reject" ? "Rejecting..." : "Reject"}
        </span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0"
            aria-label="More actions"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem asChild>
            <Link href={`/job/${jobId}`} className="cursor-pointer gap-2">
              <Eye className="size-4" />
              View job
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={`/admin/jobs/${jobId}/edit`}
              className="cursor-pointer gap-2"
            >
              <Pencil className="size-4" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={`/admin/jobs/${jobId}/delete`}
              className="cursor-pointer gap-2 text-destructive focus:text-destructive"
            >
              <Trash2 className="size-4" />
              Delete
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
