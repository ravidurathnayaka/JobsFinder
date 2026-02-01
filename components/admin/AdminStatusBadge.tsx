import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type JobPostStatus = "DRAFT" | "ACTIVE" | "EXPIRED" | "REJECTED";

const statusConfig: Record<
  JobPostStatus,
  { label: string; className: string }
> = {
  ACTIVE: {
    label: "Active",
    className:
      "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  },
  DRAFT: {
    label: "Draft",
    className: "bg-muted text-muted-foreground border-border",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-destructive/15 text-destructive border-destructive/30",
  },
  EXPIRED: {
    label: "Expired",
    className:
      "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
  },
};

export function AdminStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const config =
    statusConfig[status as JobPostStatus] ?? statusConfig.DRAFT;

  return (
    <Badge
      variant="outline"
      className={cn("font-medium border", config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
