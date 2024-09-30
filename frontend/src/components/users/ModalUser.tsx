"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, Switch } from "@headlessui/react";
import { Loader2, Trash2, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

export default function ModalCrudUser({
  open,
  setOpen,
  edit,
  remove,
  onAdded
}: {
  open: boolean;
  setOpen: (e: boolean) => void;
  edit?: any;
  remove?: string | null | undefined;
  onAdded: () => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [form, setForm] = useState<any>({
    name: "",
    email: "",
    password: "",
    manager: false
  });

  useEffect(() => {
    if (open) {
      if (edit) {
        setForm({
          ...form,
          name: edit.name,
          email: edit.email,
          manager: edit.manager,
          userId: edit.id
        });
      } else {
        setForm({ name: "", email: "", password: "", manager: false });
      }
    }
  }, [open, edit]);

  const handleAdd = async () => {
    if (form.name == "" || form.email == "" || form.password == "") {
      toast.error("Não deixe campos em branco");
      return false;
    }
    setLoading(true);
    try {
      const { data: query } = await axios.post("/api/v1/users", {
        ...form
      });
      if (query.error) {
        toast.error(query.error);
        return false;
      }
      onAdded();
      setOpen(false);
      toast.success("Usuário adicionado com sucesso!");
    } catch (error: any) {
      console.error("handleAdd", error);
      toast.error(error.message || `Erro ao adicionar usuário.`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (form.name == "" || form.email == "") {
      toast.error("Não deixe campos em branco");
      return false;
    }
    setLoading(true);
    try {
      const { data: query } = await axios.put("/api/v1/users", {
        ...form
      });
      if (query.error) {
        toast.error(query.error);
        return false;
      }
      onAdded();
      setOpen(false);
      toast.success("Usuário atualizado com sucesso!");
    } catch (error: any) {
      console.error("handleAdd", error);
      toast.error(error.message || `Erro ao atualizar usuário.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { data: query } = await axios.delete(
        `/api/v1/users?userId=${remove}`
      );
      if (!query.success) {
        setLoading(false);
        toast.error(query.error);
        return false;
      }
      onAdded();
      setOpen(false);
      toast.success("Usuário excluido com sucesso!");
    } catch (error: any) {
      console.error("handleAdd", error);
      toast.error(error.message || `Erro ao excluir usuário.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
              >
                <span className="sr-only">Close</span>
                <X aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            <div className="sm:flex sm:items-start">
              <div className="border-b border-gray-900/10 pb-12 w-full">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  {edit ? `Editar` : remove ? `Excluir` : `Adicionar`} Usuário
                </h2>
                {remove ? (
                  <>
                    <div className="mt-10 flex flex-col justify-center items-center gap-y-4">
                      <div className="w-24 h-24 bg-protectdata-100 rounded-full flex justify-center items-center mx-auto">
                        <Trash2 size={44} className="text-protectdata-950" />
                      </div>
                      <span>Deseja excluir o usuário permanentemente ?</span>
                    </div>
                  </>
                ) : (
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Nome
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          disabled={loading}
                          onChange={(e: any) =>
                            setForm({ ...form, name: e.target.value })
                          }
                          className="block w-full rounded-md border-0 py-1.5 px-2 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Email
                      </label>
                      <div className="mt-2">
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          disabled={loading}
                          onChange={(e: any) =>
                            setForm({ ...form, email: e.target.value })
                          }
                          className="block w-full rounded-md border-0 py-1.5 px-2 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Atualizar Senha
                        <small className="block -mt-2 font-medium opacity-80">
                          (só preencha se for atualizar)
                        </small>
                      </label>
                      <div className="mt-2">
                        <input
                          type="password"
                          name="password"
                          disabled={loading}
                          onChange={(e: any) =>
                            setForm({ ...form, password: e.target.value })
                          }
                          className="block w-full rounded-md border-0 py-1.5 px-2 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Administrador
                      </label>
                      <div className="mt-2">
                        <Switch
                          //disabled={session ? !session.manager : true}
                          checked={form.manager}
                          onChange={() =>
                            setForm({ ...form, manager: !form.manager })
                          }
                          className="group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-protectdata-600 focus:ring-offset-2 data-[checked]:bg-protectdata-600"
                        >
                          <span className="sr-only">Admin</span>
                          <span
                            aria-hidden="true"
                            className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                          />
                        </Switch>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                disabled={loading}
                onClick={
                  edit ? handleUpdate : remove ? handleDelete : handleAdd
                }
                className={`inline-flex disabled:cursor-not-allowed disabled:opacity-50 w-full justify-center rounded-md ${
                  remove
                    ? `bg-red-600 hover:bg-red-500`
                    : `bg-emerald-600 hover:bg-emerald-500`
                } px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto`}
              >
                {loading ? (
                  <Loader2 size={20} className="mx-auto animate-spin" />
                ) : edit ? (
                  `Salvar`
                ) : remove ? (
                  `Excluir`
                ) : (
                  `Cadastrar`
                )}
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex disabled:cursor-not-allowed disabled:opacity-50 w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancelar
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
