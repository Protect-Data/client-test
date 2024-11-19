"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, Switch } from "@headlessui/react";
import {
  AlertCircle,
  AlertOctagon,
  BookmarkCheck,
  CheckCircle2,
  ExternalLink,
  Loader2,
  X
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import Tooltip from "../tooltip";
import dayjs from "dayjs";

export default function ModalHistorico({
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

  const getScoreFromAnswer = (questionK: number, ans: string) => {
    const answer_score = data.questions[questionK].answers;
    const score = answer_score.filter((x: any) => x.title === ans)[0].score;
    return score;
  };

  const handleRate = async () => {
    if (gabarito.length <= 0) {
      toast.error("Avalie todas as questões...");
      return false;
    }
    setLoading(true);
    try {
      const { data: query }: any = await axios.post(
        `/api/v1/diagnostics/rate?id=${data.id}&caId=${data.client_answers[0].id}`,
        {
          answers: [...gabarito]
        }
      );
      if (query.error) {
        toast.error(query.error);
        return false;
      }
      setOpen(false);
      toast.success("Diagnóstico avaliado com sucesso");
    } catch (error) {
      console.log("handleValidate", error);
      toast.error("Falha ao validar o diagnóstico.");
    } finally {
      setLoading(false);
    }
  };

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
                  Histórico de Respostas{" "}
                  <small>({data ? data.length : 0})</small>
                </h2>
                <ul className="mt-4 space-y-4">
                  {data &&
                    data.map((x: any, k: number) => (
                      <li key={k} className="flex justify-between items-center">
                        <div className="text-sm text-zinc-500">
                          {dayjs(x.created_at).format("DD/MM/YYYY HH:mm[h]")}
                          <br />
                          <strong>{x.user.name}</strong>
                        </div>
                        <div className="flex items-center gap-x-4">
                          <div className="flex justify-start items-center text-md gap-x-0 font-base">
                            <strong
                              className={`text-lg ${
                                x.score <= 20
                                  ? `text-red-500`
                                  : x.score <= 75
                                  ? `text-yellow-500`
                                  : `text-emerald-500`
                              }`}
                            >
                              {x.score ? x.score : 0}
                            </strong>
                            /100
                          </div>
                          <div>
                            {x.score <= 20 ? (
                              <Tooltip text="Urgente">
                                <button
                                  className={`p-1.5 rounded-md bg-red-500 text-white disabled:cursor-not-allowed transition duration-300 ease-in-out`}
                                >
                                  <AlertOctagon size={20} />
                                </button>
                              </Tooltip>
                            ) : x.score <= 50 ? (
                              <Tooltip text="Média">
                                <button
                                  className={`p-1.5 rounded-md bg-protectdata-500 text-white disabled:cursor-not-allowed transition duration-300 ease-in-out`}
                                >
                                  <AlertCircle size={20} />
                                </button>
                              </Tooltip>
                            ) : (
                              <Tooltip text="Baixa">
                                <button
                                  className={`p-1.5 rounded-md bg-emerald-500 text-white disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 ease-in-out`}
                                >
                                  <CheckCircle2 size={20} />
                                </button>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div></div>
              <div className="flex items-center justify-end gas-x-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex disabled:cursor-not-allowed disabled:opacity-50 w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 sm:mt-0 sm:w-auto"
                >
                  Fechar
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
