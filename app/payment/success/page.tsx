"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    const controller = new AbortController();

    fetch(`/api/stripe/activate?session_id=${encodeURIComponent(sessionId)}`, {
      method: "POST",
      signal: controller.signal,
    }).catch(() => {
      // Error is logged on the server side
    });

    return () => controller.abort();
  }, [sessionId]);

  return (
    <div className="w-full h-screen flex flex-1 justify-center items-center">
      <Card className="w-[350px]">
        <div className="p-6">
          <div className="w-full flex justify-center">
            <Check className="size-12 p-2 rounded-full bg-green-500/30 text-green-500" />
          </div>

          <div className="mt-3 text-center sm:mt-5 w-full">
            <h2 className="text-xl font-semibold">Payment Successful</h2>
            <p className="text-sm mt-2 text-muted-foreground tracking-tight">
              Congratulations, your payment was successful. Your Job Posting is
              now active.
            </p>

            <Button asChild className="w-full mt-5">
              <Link href="/">Go back to Homepage</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen flex flex-1 justify-center items-center">
          <Card className="w-[350px]">
            <div className="p-6 text-center text-muted-foreground">
              Loading…
            </div>
          </Card>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
