"use client";

import axios from "axios";
import dayjs from "dayjs";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Info,
  Loader2,
  Lock
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Bold from "@tiptap/extension-bold";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { generateHTML } from "@tiptap/core";
import DrawerPolicieVersions from "@/components/policies/drawerVersions";

export default function PublicPrivacyPolicy({
  params: { uuid }
}: {
  params: { uuid: string };
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [drawer, setDrawer] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!data) {
      getPolicie();
    }
  }, [data]);

  const getPolicie = async () => {
    setLoading(true);
    try {
      const { data: query }: any = await axios.get(
        `/api/v1/policies?id=${uuid}`
      );
      setData(query);
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
  ) : !data ? (
    <>404</>
  ) : (
    <>
      <div className="w-full h-4 bg-protectdata-400 fixed top-0 left-0" />
      <div className="w-full max-w-5xl mx-auto py-4 md:py-8 lg:py-12 flex flex-col">
        <div className="flex items-center justify-between pt-4 md:pt-8 px-4">
          <div>
            <div className="text-3xl font-medium">Política de Privacidade</div>
            <div className="text-zinc-400">
              Última atualização: {dayjs(data.created_at).format("DD/MM/YYYY")}
            </div>
          </div>
          <button
            onClick={() => setDrawer(data)}
            className="flex items-center justify-end gap-x-2 text-zinc-500 group p-2 px-3 rounded-md hover:bg-zinc-100 transition duration-300 ease-in-out"
          >
            <Lock size={16} className="text-protectdata-600" />
            <strong>{data.signHash ? data.version : data.version}</strong>
            <ChevronRight size={16} className="group-hover:scale-110" />
          </button>
        </div>
        {data.signHash ? (
          <div
            className="mt-8 pt-8 border-t px-4 space-y-4 tracking-wide"
            dangerouslySetInnerHTML={{
              __html: data.content
            }}
          />
        ) : (
          <>
            <div className="mt-8 pt-8 border-t text-center opacity-70">
              A Política de Privacidade está sendo revisada e logo será
              publicada.
            </div>
          </>
        )}
      </div>
      <DrawerPolicieVersions
        open={drawer ? true : false}
        setOpen={() => setDrawer(null)}
        actual={data}
        versions={drawer ? drawer.versions : null}
      />
    </>
  );
}
