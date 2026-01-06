import { auth } from "./auth";
import { headers } from "next/headers";

export async function getServerSession() {
  const h = await headers();
  return auth.api.getSession({
    headers: h,
  });
}

