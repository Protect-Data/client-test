import { authOption } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function SessionAccess({
  children
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOption);

  if (!session) {
    return `...`;
    // redirect("/auth/login");
  }

  return <>{children}</>;
}
