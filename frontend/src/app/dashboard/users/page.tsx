"use client";

import DashboardLayout from "@/components/dashboardLayout";
import ModalCrudUser from "@/components/users/ModalUser";
import axios from "axios";
import { Edit2, Trash2, UserMinusIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const { data: session }: any = useSession();
  const [modalAdd, setModalAdd] = useState<boolean>(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [deleteUser, setDeleteUser] = useState<string | null>(null);
  const [list, setList] = useState<any>(null);

  useEffect(() => {
    if (!list) getListApi();
  }, [list]);

  const getListApi = async () => {
    try {
      const { data: list } = await axios.get("/api/v1/users");
      console.log("getListApi", list);
      setList(list);
    } catch (error) {
      console.error("getListApi", error);
    }
  };

  return (
    <>
      <DashboardLayout>
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Usuários
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Lista de usuários e administradores da plataforma.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={() => setModalAdd(true)}
              className="block rounded-md bg-protectdata-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-protectdata-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-protectdata-600"
            >
              Novo usuário
            </button>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr className="divide-x divide-gray-200">
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      Nome
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Tipo
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pr-0"
                    >
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {list &&
                    list.map((x: any, k: number) => (
                      <tr key={k} className="divide-x divide-gray-200">
                        <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-0">
                          {x.name}
                        </td>
                        <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                          {x.email}
                        </td>
                        <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                          {x.manager ? (
                            <>
                              <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                Administrador
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                Usuário
                              </span>
                            </>
                          )}
                        </td>
                        <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-0 flex items-center gap-x-1">
                          <button
                            onClick={() => {
                              setEditUser(x);
                              setModalAdd(true);
                            }}
                            className="p-2 rounded-md hover:bg-black/10 bg-black/5 transition duration-300 ease-in-out"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            disabled={
                              session && session.id === x.id ? true : false
                            }
                            onClick={() => {
                              setDeleteUser(x.id);
                              setModalAdd(true);
                            }}
                            className="p-2 rounded-md hover:bg-black/10 bg-black/5 disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 ease-in-out"
                          >
                            <Trash2 size={16} className="text-red-500" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {(!list || list.length <= 0) && (
                <div className="text-center w-full pt-8">
                  <UserMinusIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">
                    Sem registros
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    A lista de registros está vazia.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <ModalCrudUser
          open={modalAdd}
          setOpen={() => {
            setModalAdd(false);
            setEditUser(null);
            setDeleteUser(null);
          }}
          edit={editUser}
          remove={deleteUser}
          onAdded={getListApi}
        />
      </DashboardLayout>
    </>
  );
}
