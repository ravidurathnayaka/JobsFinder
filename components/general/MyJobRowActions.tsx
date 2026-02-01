"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Briefcase, MoreHorizontal, PenBoxIcon, XCircle } from "lucide-react";
import Link from "next/link";
import { DeleteJobDialog } from "@/components/general/DeleteJobDialog";
import { CopyLinkMenuItem } from "@/components/general/CopyLink";

type MyJobRowActionsProps = {
  jobId: string;
  jobTitle: string;
  jobUrl: string;
  deleteAction: (jobId: string) => Promise<void>;
};

export function MyJobRowActions({
  jobId,
  jobTitle,
  jobUrl,
  deleteAction,
}: MyJobRowActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={`/my-jobs/${jobId}/edit`}>
              <PenBoxIcon className="size-4" />
              Edit Job
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/my-jobs/${jobId}/analytics`}>
              <Briefcase className="size-4" />
              Analytics
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/my-jobs/${jobId}/applications`}>
              <Briefcase className="size-4" />
              Applications
            </Link>
          </DropdownMenuItem>
          <CopyLinkMenuItem jobUrl={jobUrl} />
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => {
              // Open dialog on next tick so dropdown closes first; avoids first click being swallowed
              setTimeout(() => setDeleteDialogOpen(true), 0);
            }}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <XCircle className="h-4 w-4" />
            Delete Job
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteJobDialog
        jobId={jobId}
        jobTitle={jobTitle}
        deleteAction={deleteAction}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  );
}
