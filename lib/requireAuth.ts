import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAuth(roles?: string[]) {
  const headerList = await headers();
  const pathname = headerList.get("x-current-path");

  const session = await auth.api.getSession({
    headers: headerList,
  });

  if (!session) {
    redirect(`/login?from=${pathname?.split("/")[1]}`);
  }

  if (roles && !roles.includes(session?.user?.role as string)) {
    redirect("/unauthorized");
  }

  return session;
}
