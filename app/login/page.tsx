import { redirect } from "next/navigation";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string; role?: string };
}) {
  const params = new URLSearchParams();
  if (searchParams.callbackUrl) {
    params.set("callbackUrl", searchParams.callbackUrl);
  }
  if (searchParams.role) {
    params.set("role", searchParams.role);
  }
  const queryString = params.toString();
  redirect(`/sign-in${queryString ? `?${queryString}` : ""}`);
}

