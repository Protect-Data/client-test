"use client";

import DashboardLayout from "@/components/dashboardLayout";
import ModalDiagnostic from "@/components/diagnostics/modalDiag";
import ModalGabarito from "@/components/diagnostics/modalGabarito";
import ModalHistorico from "@/components/diagnostics/modalHistoric";
import Tooltip from "@/components/tooltip";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import axios from "axios";
import dayjs from "dayjs";
import {
  AlertTriangle,
  CheckSquare,
  CheckSquare2,
  Clock,
  Edit2,
  ExternalLink,
  EyeIcon,
  MoreVertical,
  PlusIcon,
  ReceiptText,
  Trash2
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function DiagnosticsPage() {
  const { data: session }: any = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [list, setList] = useState<any>(null);
  const [modal, setModal] = useState<any>(null);
  const [modalGab, setModalGab] = useState<any>(null);
  const [modalHis, setModalHis] = useState<any>(null);

  useEffect(() => {
    if (!list) getAllDiags();
  }, [list]);

  const getAllDiags = async () => {
    setLoading(true);
    try {
      const { data: query }: any = await axios.get("/api/v1/diagnostics");
      if (query.error) {
        toast.error(query.error);
        return false;
      }
      setList(query);
    } catch (error) {
      console.error("getAllFiles", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDiagnostic = async (diagId: string) => {
    try {
      if (!window.confirm("Excluir o diagnóstico permanentemente ?")) {
        toast.error("Cancelado pelo usuário...");
        return false;
      }
      const { data: query }: any = await axios.delete(
        `/api/v1/diagnostics?diagId=${diagId}`
      );
      if (query.error) {
        toast.error(query.error);
        return false;
      }
      await getAllDiags();
      toast.success("Diagnóstico excluído com sucesso");
      // update task data
    } catch (error) {
      console.error("getTasksList"), error;
      toast.error(`Falha ao excluir diagnóstico.`);
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
          <>
            <table className="min-w-full divide-y divide-zinc-300 animate-pulse">
              <thead>
                <tr className="divide-x divide-zinc-200">
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-zinc-900 sm:pl-0"
                  >
                    <div className="w-44 h-4 bg-zinc-300 rounded-md mb-1" />
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-left text-sm font-semibold text-zinc-900"
                  >
                    <div className="w-20 h-4 bg-zinc-300 rounded-md mb-1" />
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-left text-sm font-semibold text-zinc-900"
                  >
                    <div className="w-44 h-4 bg-zinc-300 rounded-md mb-1" />
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-zinc-900 sm:pr-0"
                  >
                    <div className="w-24 h-4 bg-zinc-300 rounded-md mb-1" />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 bg-white">
                {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((x: any, k: number) => (
                  <tr key={k} className="divide-x divide-zinc-200">
                    <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-zinc-900 sm:pl-0">
                      <div className="w-32 h-4 bg-zinc-300 rounded-md mb-1" />
                    </td>
                    <td className="whitespace-nowrap p-4 text-sm font-semibold text-zinc-500">
                      <div className="w-44 h-4 bg-zinc-300 rounded-md mb-1" />
                    </td>
                    <td className="whitespace-nowrap p-4 text-sm text-zinc-400 font-semibold">
                      <div className="w-20 h-4 bg-zinc-300 rounded-md mb-1" />
                    </td>
                    <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-zinc-500 sm:pr-0 flex items-center gap-x-1">
                      <div className="w-8 h-8 bg-zinc-300 rounded-md mb-1" />
                      <div className="w-8 h-8 bg-zinc-300 rounded-md mb-1" />
                      <div className="w-8 h-8 bg-zinc-300 rounded-md mb-1" />
                      <div className="w-8 h-8 bg-zinc-300 rounded-md mb-1" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
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
                            {x.client_answers.length <= 0 ? (
                              <></>
                            ) : (
                              <>
                                <strong
                                  className={`font-bold text-lg ${
                                    x.client_answers && x.client_answers.length
                                      ? x.client_answers[0].score <= 20
                                        ? `text-red-500`
                                        : x.client_answers[0].score <= 75
                                        ? `text-yellow-500`
                                        : `text-emerald-500`
                                      : ``
                                  }`}
                                >
                                  {x.client_answers &&
                                  x.client_answers.length >= 1
                                    ? x.client_answers[0].score === 0
                                      ? `?`
                                      : x.client_answers[0].score
                                    : `?`}
                                </strong>
                                /100
                              </>
                            )}
                          </td>
                          <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-zinc-500 sm:pr-0 flex items-center gap-x-1">
                            {session && session.manager && (
                              <Tooltip text="Editar">
                                <button
                                  onClick={() => setModal(x)}
                                  className="p-2 rounded-md hover:bg-black/10 bg-black/5 transition duration-300 ease-in-out"
                                >
                                  <Edit2 size={16} />
                                </button>
                              </Tooltip>
                            )}
                            {x.client_answers ? (
                              <>
                                <Tooltip text="Gabaritos">
                                  <button
                                    disabled={x.client_answers.length <= 0}
                                    onClick={() => setModalGab(x)}
                                    className="p-2 block rounded-md hover:bg-black/10 bg-black/5 disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 ease-in-out"
                                  >
                                    <ReceiptText size={16} />
                                  </button>
                                </Tooltip>
                                {x.client_answers.length >= 2 && (
                                  <Tooltip text="Histórico">
                                    <button
                                      disabled={x.client_answers.length < 2}
                                      onClick={() => setModalHis(x)}
                                      className="p-2 block rounded-md hover:bg-black/10 bg-black/5 disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 ease-in-out"
                                    >
                                      <Clock size={16} />
                                    </button>
                                  </Tooltip>
                                )}
                              </>
                            ) : (
                              <></>
                            )}
                            <Tooltip text="Acessar">
                              <Link
                                href={`/dashboard/diagnostics/${x.id}`}
                                target="_blank"
                                className="p-2 block rounded-md hover:bg-black/10 bg-black/5 disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 ease-in-out"
                              >
                                <ExternalLink size={16} />
                              </Link>
                            </Tooltip>
                            {session && session.manager && (
                              <Tooltip text="Excluir">
                                <button
                                  onClick={() => handleDeleteDiagnostic(x.id)}
                                  className="p-2 text-red-500 rounded-md hover:bg-black/10 bg-black/5 disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 ease-in-out"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </Tooltip>
                            )}
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
        <ModalGabarito
          open={modalGab ? true : false}
          setOpen={() => setModalGab(null)}
          data={{ ...modalGab }}
          diagTitle={modalGab ? modalGab.title : null}
          onReload={getAllDiags}
        />
        <ModalHistorico
          open={modalHis ? true : false}
          setOpen={() => setModalHis(null)}
          data={modalHis ? modalHis.client_answers : null}
        />
      </DashboardLayout>
    </>
  );
}
