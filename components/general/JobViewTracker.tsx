"use client";

import { useEffect } from "react";

export function JobViewTracker({ jobId }: { jobId: string }) {
  useEffect(() => {
    // Track view when component mounts
    fetch(`/api/jobs/${jobId}/view`, {
      method: "POST",
    }).catch(() => {
      // Silently fail - analytics shouldn't break the page
      // Error is logged on the server side
    });
  }, [jobId]);

  return null;
}
