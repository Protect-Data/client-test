import DashboardLayout from "@/components/dashboardLayout";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

export default function Dashboard() {
  redirect("/dashboard/tasks");

  return (
    <>
      <DashboardLayout>
        <div className="w-full text-center h-full flex flex-col justify-center items-center text-zinc-500 font-semibold text-sm">
          <Loader2 size={20} className="animate-spin mb-2" />
          CARREGANDO...
        </div>
      </DashboardLayout>
    </>
  );
}
