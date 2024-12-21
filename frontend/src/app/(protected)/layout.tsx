import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOption } from "../api/auth/[...nextauth]/route";
import { ReactNode } from "react";

export default async function LayoutProtected({
  children
}: {
  children: ReactNode;
}) {
  const session: any = await getServerSession(authOption);

  if (!session) {
    redirect("/auth/login");
  } else if (session && !session.two_factor.authenticated) {
    redirect("/auth/two-factor");
  }

  return <>{children}</>;
}
