"use client";

import axios from "axios";
import dayjs from "dayjs";
import { Info, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function PublicPrivacyPolicy({
  params: { uuid }
}: {
  params: { uuid: string };
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>(null);

  useEffect(() => {
    if (!list) getPolicie();
  }, [list]);

  const getPolicie = async () => {
    setLoading(true);
    try {
      const { data: query }: any = await axios.get(
        `/api/v1/policies?id=${uuid}`
      );
      setList(query);
    } catch (error) {
      console.error("getAllPolicies", error);
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <>
      <div className="w-full h-screen flex justify-center items-center">
        <Loader2 size={20} className="mx-auto animate-spin" />
      </div>
    </>
  ) : !list ? (
    <>404</>
  ) : (
    <>
      <div className="w-full max-w-6xl mx-auto py-4 md:py-8 lg:py-12 flex flex-col justify-center">
        <div className="text-4xl font-medium text-center">
          Política de Privacidade
        </div>
        <div className="flex justify-center items-center gap-x-2 text-zinc-400 mb-8 md:mb-12 text-center">
          Atualizado em {dayjs(list.created_at).format("DD/MM/YYYY HH:mm[h]")}{" "}
          <Info size={16} />
        </div>
        {list.signHash ? <div></div> : <div>Assinatura pendente.</div>}
      </div>
    </>
  );
}
