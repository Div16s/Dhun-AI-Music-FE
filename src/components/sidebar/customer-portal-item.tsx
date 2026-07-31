"use client";

import { CreditCard } from "lucide-react";
import { toast } from "sonner";

import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { authClient } from "~/lib/auth-client";

export function CustomerPortalItem() {
  const openPortal = async () => {
    try {
      await authClient.customer.portal();
    } catch {
      toast.error("Couldn't open the billing portal. Please try again.");
    }
  };

  return (
    <DropdownMenuItem onClick={openPortal}>
      <CreditCard />
      Billing
    </DropdownMenuItem>
  );
}
