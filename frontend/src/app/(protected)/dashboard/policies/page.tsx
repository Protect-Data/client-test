"use client";

import DashboardLayout from "@/components/dashboardLayout";
import ModalPolicies from "@/components/policies/modalPolicies";
import Tooltip from "@/components/tooltip";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import axios from "axios";
import dayjs from "dayjs";
import {
  AlertTriangle,
  Edit2,
  ExternalLink,
  MoreVertical,
  PlusIcon,
  Trash2
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function PrivacyPoliciesPage() {
  const { data: session }: any = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>(null);
  const [modal, setModal] = useState<any>(null);

  useEffect(() => {
    if (!list) getAllPolicies();
  }, [list]);

  const getAllPolicies = async () => {
    setLoading(true);
    try {
      const { data: query }: any = await axios.get("/api/v1/policies");
      if (query.error) {
        toast.error(query.error);
        return false;
      }
      setList(query);
    } catch (error) {
      console.error("getAllPolicies", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePolicy = async (diagId: string) => {
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
      await getAllPolicies();
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
              Políticas de Privacidade
            </h1>
            <p className="mt-2 text-sm text-zinc-700">
              Versionamento, atualização e criação de novas versões.
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
          <ul className="w-full grid grid-cols-1 gap-3 pt-2">
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
                  Sem Políticas
                </h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Sua lista de políticas de privacidade está vazia.
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-y-2">
                  {list &&
                    list.map((x: any, k: number) => (
                      <div
                        key={k}
                        className="col-span-1 border border-zinc-200 flex justify-between items-center gap-x-2 bg-black/5 rounded-md p-2 transition duration-300 ease-in-out"
                      >
                        <div className="flex items-center gap-x-3">
                          <div className="w-12 h-12 bg-zinc-200 flex justify-center items-center text-xs font-bold rounded-md">
                            1.0
                          </div>
                          <div>
                            <div className="mb-1">{x.author}</div>
                            <div className="mb-1 text-xs">
                              {x.signHash ? (
                                <span className="font-bold text-emerald-500">
                                  Assinado
                                </span>
                              ) : (
                                <span className="font-bold text-protectdata-600">
                                  Pendente
                                </span>
                              )}{" "}
                              &bull;
                              {` `}
                              {dayjs(x.created_at).format(
                                "DD/MM/YYYY HH:mm[h]"
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <Menu
                            as="div"
                            className="relative inline-block text-left"
                          >
                            <div>
                              <MenuButton className="px-2">
                                <MoreVertical size={16} />
                              </MenuButton>
                            </div>
                            <MenuItems
                              transition
                              className="absolute right-0 z-10 mt-1 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                            >
                              <div className="py-1">
                                <MenuItem>
                                  <Link
                                    href={`/privacy-policy/${x.id}`}
                                    target="_blank"
                                    className="w-full block text-left px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                                  >
                                    Visualizar
                                  </Link>
                                </MenuItem>
                                <MenuItem>
                                  <button
                                    type="button"
                                    onClick={() => setModal(x)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                                  >
                                    Editar
                                  </button>
                                </MenuItem>
                                {session && session.manager && !x.signHash && (
                                  <MenuItem>
                                    <button
                                      type="button"
                                      onClick={() => {}}
                                      className="w-full text-left px-4 py-2 text-sm text-emerald-500 data-[focus]:bg-gray-100 data-[focus]:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      Assinar
                                    </button>
                                  </MenuItem>
                                )}
                                {session && session.manager && (
                                  <MenuItem>
                                    <button
                                      type="button"
                                      onClick={() => handleDeletePolicy(x.id)}
                                      className="w-full text-left px-4 py-2 text-sm text-red-600 data-[focus]:bg-gray-100 data-[focus]:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      Excluir
                                    </button>
                                  </MenuItem>
                                )}
                              </div>
                            </MenuItems>
                          </Menu>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}
          </>
        )}
        <ModalPolicies
          open={modal ? true : false}
          edit={!modal ? null : typeof modal === "boolean" ? null : modal}
          setOpen={() => setModal(null)}
          onAdded={getAllPolicies}
        />
      </DashboardLayout>
    </>
  );
}