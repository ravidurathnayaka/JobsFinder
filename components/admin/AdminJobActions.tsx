"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { adminApproveJob, adminRejectJob } from "@/app/actions";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";

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
    <div className="flex flex-col items-end gap-2">
      <div className="flex gap-2">
        <Button size="sm" variant="outline" asChild>
          <Link href={`/admin/jobs/${jobId}`}>
            <Eye className="size-4" />
            View
          </Link>
        </Button>
        <Button size="sm" variant="outline" asChild>
          <Link href={`/admin/jobs/${jobId}/edit`}>
            <Pencil className="size-4" />
            Update
          </Link>
        </Button>
        <Button size="sm" variant="outline" asChild>
          <Link href={`/admin/jobs/${jobId}/delete`}>
            <Trash2 className="size-4" />
            Delete
          </Link>
        </Button>
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          disabled={isBusy || isApproved}
          onClick={() => handleAction("approve")}
        >
          {pendingAction === "approve" ? "Approving..." : "Approve"}
        </Button>
        <Button
          size="sm"
          variant="destructive"
          disabled={isBusy || isRejected}
          onClick={() => handleAction("reject")}
        >
          {pendingAction === "reject" ? "Rejecting..." : "Reject"}
        </Button>
      </div>
    </div>
  );
}
