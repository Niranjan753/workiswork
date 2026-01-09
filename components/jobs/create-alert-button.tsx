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
        className="border-2 border-black bg-yellow-400 px-5 py-2 text-xs font-bold text-black hover:bg-black hover:text-yellow-400 transition-all shadow-lg"
      >
        Create alert
      </button>
      <Dialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <DialogContent className="border-2 border-black bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-black">
              Join to Create Job Alerts
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-black/80 pt-2">
              Join WorkIsWork to create personalized job alerts and get notified about new opportunities.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Link
              href="/join"
              className="px-6 py-3 border-2 border-black bg-yellow-400 text-black text-sm font-bold hover:bg-yellow-500 transition-colors shadow-md"
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

