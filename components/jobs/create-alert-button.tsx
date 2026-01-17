"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "../../lib/auth-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export function CreateAlertButton() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [showAlertDialog, setShowAlertDialog] = React.useState(false);

  const handleClick = () => {
    if (!session?.user) {
      setShowAlertDialog(true);
    } else {
      router.push("/alerts");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="px-5 py-2 text-xs font-bold text-foreground border border-border rounded-md hover:bg-secondary transition-all shadow-sm"
      >
        Create alert
      </button>
      <Dialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <DialogContent className="border border-border bg-background">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              Join to Create Job Alerts
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-muted-foreground pt-2">
              Join WorkIsWork to create personalized job alerts and get notified about new opportunities.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Link
              href="/join"
              className="px-6 py-3 bg-primary text-primary-foreground text-sm font-bold rounded-md hover:bg-primary/90 transition-colors shadow-sm"
              onClick={() => setShowAlertDialog(false)}
            >
              Join Now
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

