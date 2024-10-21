"use client";

import DashboardLayout from "@/components/dashboardLayout";
import ModalDiagnostic from "@/components/diagnostics/modalDiag";
import Tooltip from "@/components/tooltip";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import axios from "axios";
import dayjs from "dayjs";
import {
  AlertTriangle,
  CheckSquare,
  Edit2,
  EyeIcon,
  MoreVertical,
  PlusIcon,
  Trash2
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function DiagnosticsPage() {
  const { data: session }: any = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>(null);
  const [modal, setModal] = useState<any>(null);

  useEffect(() => {
    if (!list) getAllDiags();
  }, [list]);

  const getAllDiags = async () => {
    setLoading(true);
    try {
      const { data: _files }: any = await axios.get("/api/v1/diagnostics");
      setList(_files);
    } catch (error) {
      console.error("getAllFiles", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DashboardLayout>
        <div className="mb-8 sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-zinc-900">
              Diagnósticos
            </h1>
            <p className="mt-2 text-sm text-zinc-700">
              Diagnósticos e Formulários de Incidentes
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            {session && session.manager && (
              <button
                type="button"
                onClick={() => setModal(true)}
                className="rounded-md flex items-center gap-x-1 bg-protectdata-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-protectdata-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-protectdata-600"
              >
                <PlusIcon size={16} />
                Adicionar
              </button>
            )}
          </div>
        </div>
        {loading ? (
          <ul className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            {[
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0
            ].map((x: any, k: number) => (
              <div
                key={k}
                className="col-span-1 animate-pulse border border-zinc-200 flex justify-between items-center gap-x-2 bg-black/5 rounded-md p-2 transition duration-300 ease-in-out"
              >
                <div className="flex items-center gap-x-3">
                  <div className="w-11 h-11 bg-zinc-300 rounded-md" />
                  <div>
                    <div className="w-44 h-4 bg-zinc-300 rounded-md mb-1" />
                    <div className="w-24 h-4 bg-zinc-300 rounded-md mb-1" />
                  </div>
                </div>
                <div>
                  <div className="w-4 h-8 bg-zinc-300 rounded-md mb-1" />
                </div>
              </div>
            ))}
          </ul>
        ) : (
          <>
            {!list || list.length <= 0 ? (
              <div className="text-center w-full py-8">
                <AlertTriangle className="mx-auto h-12 w-12 text-zinc-400" />
                <h3 className="mt-2 text-sm font-semibold text-zinc-900">
                  Sem diagnósticos
                </h3>
                <p className="mt-1 text-sm text-zinc-500">
                  A lista de diagnósticos está vazia.
                </p>
              </div>
            ) : (
              <>
                <table className="min-w-full divide-y divide-zinc-300">
                  <thead>
                    <tr className="divide-x divide-zinc-200">
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-zinc-900 sm:pl-0"
                      >
                        Título
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-semibold text-zinc-900"
                      >
                        Questões
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-semibold text-zinc-900"
                      >
                        Pontuação
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-zinc-900 sm:pr-0"
                      >
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 bg-white">
                    {list &&
                      list.map((x: any, k: number) => (
                        <tr key={k} className="divide-x divide-zinc-200">
                          <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-zinc-900 sm:pl-0">
                            {x.title}
                          </td>
                          <td className="whitespace-nowrap p-4 text-sm font-semibold text-zinc-500">
                            {x.questions.length}
                          </td>
                          <td className="whitespace-nowrap p-4 text-sm text-zinc-400 font-semibold">
                            <strong
                              className={`font-bold text-lg text-red-500`}
                            >
                              0
                            </strong>
                            /100
                          </td>
                          <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-zinc-500 sm:pr-0 flex items-center gap-x-1">
                            <Tooltip text="Editar">
                              <button
                                onClick={() => setModal(x)}
                                className="p-2 rounded-md hover:bg-black/10 bg-black/5 transition duration-300 ease-in-out"
                              >
                                <Edit2 size={16} />
                              </button>
                            </Tooltip>
                            <Tooltip text="Visualizar">
                              <button
                                disabled
                                //onClick={() => setModal(x)}
                                className="p-2 rounded-md hover:bg-black/10 bg-black/5 disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 ease-in-out"
                              >
                                <EyeIcon size={16} />
                              </button>
                            </Tooltip>
                            <Tooltip text="Excluir">
                              <button
                                disabled
                                //onClick={() => setModal(x)}
                                className="p-2 text-red-500 rounded-md hover:bg-black/10 bg-black/5 disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 ease-in-out"
                              >
                                <Trash2 size={16} />
                              </button>
                            </Tooltip>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </>
            )}
          </>
        )}
        <ModalDiagnostic
          open={modal ? true : false}
          edit={!modal ? null : typeof modal === "boolean" ? null : modal}
          setOpen={() => setModal(null)}
          onAdded={getAllDiags}
        />
      </DashboardLayout>
    </>
  );
}
