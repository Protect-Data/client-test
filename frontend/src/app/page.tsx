import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOption } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOption);

  if (session) {
    redirect("/dashboard");
  } else {
    redirect("/auth/login");
  }
}
