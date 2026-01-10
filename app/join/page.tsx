import type { Metadata } from "next";
import { Suspense } from "react";
import { JoinWizard } from "@/components/join/join-wizard";

export const metadata: Metadata = {
  title: "Join – WorkIsWork Onboarding",
  description: "Answer a few quick questions so we can better match you with remote roles.",
};

export default function JoinPage() {
  return (
    <Suspense fallback={null}>
      <JoinWizard />
    </Suspense>
  );
}

