"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, Switch } from "@headlessui/react";
import { ExternalLink, Loader2, Trash2, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ModalSignPrivacyPolicy({
  open,
  setOpen,
  data,
  onPublish
}: {
  open: boolean;
  setOpen: (e: boolean) => void;
  data: any;
  onPublish: () => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);

  const handlePublish = async () => {
    setLoading(true);
    try {
      const { data: query } = await axios.get(
        `/api/v1/policies/publish?id=${data.id}`
      );
      if (query.error) {
        toast.error(query.error);
        return false;
      }
      onPublish();
      setOpen(false);
      toast.success("A Política de Privacidade foi publicada!");
    } catch (error: any) {
      console.error("handleAdd", error);
      toast.error(error.message || `Erro ao publicar política de privacidade.`);
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
                  Publicação de Política
                </h2>
                {data && (
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Autor
                      </label>
                      <div className="mt-2">{data.author}</div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Versão
                      </label>
                      <div className="mt-2">{data.version}</div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Status
                      </label>
                      <div
                        className={`mt-2 font-semibold ${
                          data.signHash
                            ? `text-emerald-500`
                            : `text-protectdata-600`
                        }`}
                      >
                        {data.signHash ? `Publicado` : `Pendente`}
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Pré-Visualizar
                      </label>
                      <div className="mt-2">
                        <Link
                          href={`/privacy-policy/${data.id}?preview=true`}
                          target="_blank"
                          className="flex items-center gap-x-2 opacity-50 text-sm hover:opacity-100 transition duration-300 ease-in-out"
                        >
                          <ExternalLink size={16} /> Acessar
                        </Link>
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
                onClick={handlePublish}
                className={`inline-flex disabled:cursor-not-allowed disabled:opacity-50 w-full justify-center rounded-md bg-emerald-600 hover:bg-emerald-500 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto`}
              >
                {loading ? (
                  <Loader2 size={20} className="mx-auto animate-spin" />
                ) : (
                  `Publicar`
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
