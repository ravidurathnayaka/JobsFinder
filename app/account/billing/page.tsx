"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, FileText, RefreshCw } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function BillingPage() {
  const [isPending, startTransition] = useTransition();

  const handleOpenPortal = () => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/billing/portal", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Failed to open billing portal");
        }

        const data = await response.json();
        window.location.href = data.url;
      } catch (error) {
        console.error("Error opening billing portal:", error);
        toast.error("Failed to open billing portal. Please try again.");
      }
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Billing & Invoices</h1>
        <p className="text-muted-foreground">
          Manage your billing information and view invoices
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Billing Portal</CardTitle>
          <CardDescription>
            Access your billing portal to manage payment methods, view invoices, and update your subscription.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium">Manage Payment Methods</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Update your credit card and payment information
              </p>
            </div>
            <Button
              onClick={handleOpenPortal}
              disabled={isPending}
              variant="outline"
            >
              {isPending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Opening...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Open Portal
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium">View Invoices</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Download and view your payment history
              </p>
            </div>
            <Button
              onClick={handleOpenPortal}
              disabled={isPending}
              variant="outline"
            >
              {isPending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Opening...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  View Invoices
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
