"use client";

import DashboardLayout from "@/components/dashboardLayout";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import axios from "axios";
import dayjs from "dayjs";
import { AlertTriangle, CheckSquare, MoreVertical } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function DocumentsPage() {
  const { data: session }: any = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [files, setFiles] = useState<any>(null);

  useEffect(() => {
    if (!files) getAllFiles();
  }, [files]);

  const getAllFiles = async () => {
    setLoading(true);
    try {
      const { data: _files }: any = await axios.get("/api/v1/files");
      setFiles(_files);
    } catch (error) {
      console.error("getAllFiles", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      if (!window.confirm("Deseja excluir o documento ?")) {
        toast.error("Ação cancelada...");
        return false;
      }
      const { data: query }: any = await axios.delete(
        `/api/v1/files?fileId=${fileId}`
      );
      if (query.error) {
        toast.error(query.error);
        return false;
      }
      await getAllFiles();
      toast.success("Documento excluído com sucesso");
      // update task data
    } catch (error) {
      console.error("handleDeleteFile"), error;
      toast.error(`Falha ao excluir documento.`);
    }
  };

  return (
    <>
      <DashboardLayout>
        <div className="mb-8 sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Documentos
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Todos os arquivos enviados e anexados à tarefas.
            </p>
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
            {(!files || files.length <= 0) && (
              <div className="text-center w-full py-8">
                <AlertTriangle className="mx-auto h-12 w-12 text-zinc-400" />
                <h3 className="mt-2 text-sm font-semibold text-zinc-900">
                  Sem registros
                </h3>
                <p className="mt-1 text-sm text-zinc-500">
                  A lista de documentos está vazia.
                </p>
              </div>
            )}
            <ul className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              {files &&
                files.map((x: any, k: number) => (
                  <div
                    key={k}
                    className="col-span-1 border border-zinc-200 hover:border-zinc-400 cursor-pointer flex justify-between items-center gap-x-2 bg-black/5 hover:bg-black/10 rounded-md p-2 transition duration-300 ease-in-out"
                  >
                    <div className="flex items-center gap-x-3">
                      <Image
                        width={44}
                        height={44}
                        alt={x.mimetype}
                        src={`/assets/files/${
                          x.mimetype.includes("spreadsheetml.sheet")
                            ? `xls`
                            : x.mimetype.includes("wordprocessingml.document")
                            ? `doc`
                            : x.mimetype.split("/")[1]
                        }.png`}
                      />
                      <div>
                        <span>
                          {x.filename.substring(0, 30)}
                          {x.filename.length > 30 && `...`}
                        </span>
                        <span className="text-zinc-500 text-xs flex items-center gap-x-1 capitalize">
                          <CheckSquare size={12} />
                          {x.task.title.substring(0, 15)}
                          {x.task.title.length > 15 && `...`} |{` `}
                          {dayjs(x.created_at).format("DD/MM/YYYY HH:mm")}
                        </span>
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
                                href={x.uri}
                                target="_blank"
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                              >
                                Visualizar
                              </Link>
                            </MenuItem>
                            {session && session.manager && (
                              <MenuItem>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteFile(x.id)}
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
            </ul>
          </>
        )}
      </DashboardLayout>
    </>
  );
}
