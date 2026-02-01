"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, FileText, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type LoadingAction = "portal" | "invoices" | null;

export default function BillingPage() {
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);

  const handleOpenPortal = async (action: "portal" | "invoices") => {
    if (loadingAction) return;
    setLoadingAction(action);
    try {
      const response = await fetch("/api/billing/portal", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        const message =
          data?.error?.message ?? data?.error ?? "Failed to open billing portal. Please try again.";
        toast.error(message);
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error("Invalid response from server. Please try again.");
      }
    } catch (error) {
      console.error("Error opening billing portal:", error);
      toast.error("Failed to open billing portal. Please try again.");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Billing</h1>
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
              onClick={() => handleOpenPortal("portal")}
              disabled={loadingAction !== null}
              variant="outline"
            >
              {loadingAction === "portal" ? (
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
              onClick={() => handleOpenPortal("invoices")}
              disabled={loadingAction !== null}
              variant="outline"
            >
              {loadingAction === "invoices" ? (
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
