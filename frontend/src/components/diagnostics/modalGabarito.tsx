"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, Switch } from "@headlessui/react";
import {
  AlertCircle,
  AlertOctagon,
  CheckCircle2,
  CheckSquare2,
  Loader2,
  Plus,
  PlusCircle,
  Trash2,
  X
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import classNames from "@/utils/classNames";
import Tooltip from "../tooltip";

export default function ModalGabarito({
  open,
  setOpen,
  data
}: {
  open: boolean;
  setOpen: (e: boolean) => void;
  data?: any;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [gabarito, setGabarito] = useState<any>([]);

  const checkGabarito = (questionK: any, score: number) => {
    const novoGabarito = [...gabarito];
    novoGabarito[questionK] = score;
    setGabarito(novoGabarito);
  };

  const handleValidate = async () => {};

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-zinc-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md bg-white text-zinc-400 hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
              >
                <span className="sr-only">Close</span>
                <X aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            <div className="sm:flex sm:items-start">
              <div className="border-b border-zinc-900/10 pb-12 w-full">
                <h2 className="text-base font-semibold leading-7 text-zinc-900">
                  Avaliação do Diagnóstico
                </h2>
                {data && (
                  <>
                    <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      {data.questions &&
                        data.questions.map((x: any, k: number) => (
                          <>
                            <div className="sm:col-span-3">
                              <label
                                htmlFor="name"
                                className="block text-sm font-medium leading-6 text-zinc-900"
                              >
                                {x.title}
                              </label>
                              <div className="mt-2 text-sm font-bold">
                                {data.client_answers
                                  ? data.client_answers[0].response[k]
                                  : `...`}
                              </div>
                            </div>
                            {data.questions &&
                            data.questions[k].answers.length <= 0 ? (
                              <>
                                <div className="sm:col-span-3 text-right">
                                  <label
                                    htmlFor="name"
                                    className="block text-sm font-medium leading-6 text-zinc-900"
                                  >
                                    &nbsp;
                                  </label>
                                  <div className="mt-2 flex justify-end items-center gap-x-2 font-bold">
                                    {data.questions &&
                                    data.questions[k].answers.length <= 0 ? (
                                      <>
                                        <button
                                          onClick={() => checkGabarito(k, 3)}
                                          className={`p-1.5 rounded-md ${
                                            gabarito[k] && gabarito[k] === 3
                                              ? `bg-emerald-500 text-white hover:bg-emerald-600`
                                              : `bg-black/5 text-emerald-500 hover:bg-black/10`
                                          } transition duration-300 ease-in-out`}
                                        >
                                          <CheckCircle2 size={20} />
                                        </button>
                                        <button
                                          onClick={() => checkGabarito(k, 2)}
                                          className={`p-1.5 rounded-md ${
                                            gabarito[k] && gabarito[k] === 2
                                              ? `bg-protectdata-500 text-white hover:bg-protectdata-600`
                                              : `bg-black/5 text-protectdata-500 hover:bg-black/10`
                                          } transition duration-300 ease-in-out`}
                                        >
                                          <AlertCircle size={20} />
                                        </button>
                                        <button
                                          onClick={() => checkGabarito(k, 1)}
                                          className={`p-1.5 rounded-md ${
                                            gabarito[k] && gabarito[k] === 1
                                              ? `bg-red-500 text-white hover:bg-red-600`
                                              : `bg-black/5 text-red-500 hover:bg-black/10`
                                          } transition duration-300 ease-in-out`}
                                        >
                                          <AlertOctagon size={20} />
                                        </button>
                                      </>
                                    ) : null}
                                  </div>
                                </div>
                              </>
                            ) : null}
                          </>
                        ))}
                      {data.client_answers &&
                        data.client_answers[0].score > 0 && (
                          <div className="sm:col-span-6">
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium leading-6 text-zinc-900"
                            >
                              Nota Final
                            </label>
                            <div className="flex justify-start items-center text-md gap-x-0 font-base">
                              <strong className="text-lg text-protectdata-500">
                                {data.client_answers
                                  ? data.client_answers[0].score
                                  : 0}
                              </strong>
                              /100
                            </div>
                          </div>
                        )}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                disabled={loading}
                onClick={handleValidate}
                className={`inline-flex disabled:cursor-not-allowed disabled:opacity-50 w-full justify-center rounded-md bg-emerald-600 hover:bg-emerald-500 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto`}
              >
                {loading ? (
                  <Loader2 size={20} className="mx-auto animate-spin" />
                ) : (
                  `Avaliar`
                )}
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex disabled:cursor-not-allowed disabled:opacity-50 w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 sm:mt-0 sm:w-auto"
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
