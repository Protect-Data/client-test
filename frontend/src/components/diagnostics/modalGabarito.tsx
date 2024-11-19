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

export default function ModalGabarito({
  open,
  setOpen,
  data,
  diagTitle,
  onReload
}: {
  open: boolean;
  setOpen: (e: boolean) => void;
  data?: any;
  diagTitle?: string | null;
  onReload: () => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingT, setLoadingT] = useState<boolean>(false);
  const [gabarito, setGabarito] = useState<any>([]);
  const [tasks, setTasks] = useState<any>([]);

  useEffect(() => {
    if (data) {
      setTasks([]);
      setGabarito([]);
    }
  }, [data]);

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
      onReload();
      setOpen(false);
      toast.success("Diagnóstico avaliado com sucesso");
    } catch (error) {
      console.log("handleValidate", error);
      toast.error("Falha ao validar o diagnóstico.");
    } finally {
      setLoading(false);
    }
  };

  const handleTask = ({
    question,
    answer
  }: {
    question: string;
    answer: string;
  }) => {
    // ADD TASK TO ARRAY
    const newTasks = [...tasks];
    const alreadyHas = newTasks.filter((x: any) => x.question === question);
    if (alreadyHas.length >= 1) {
      const index = newTasks.indexOf(alreadyHas[0]);
      newTasks.splice(index, 1);
    } else {
      newTasks.push({ question, answer });
    }
    setTasks(newTasks);
  };

  const generateTask = async () => {
    setLoadingT(true);
    try {
      const { data: query }: any = await axios.post(
        `/api/v1/diagnostics/task?diagId=${data.id}`,
        {
          title: diagTitle,
          tasks
        }
      );
      if (query.error) {
        toast.error(query.error);
        return false;
      }
      onReload();
      setOpen(false);
      toast.success("Tarefa criada com sucesso!");
    } catch (error) {
      console.log("handleValidate", error);
      toast.error("Falha ao gerar a tarefa.");
    } finally {
      setLoadingT(false);
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
            className="relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:flex">
              {tasks.length > 0 && (
                <>
                  <div className="pr-4 mr-4 border-r border-zinc-300">
                    <Tooltip text="Gerar Tarefa">
                      <button
                        type="button"
                        disabled={loadingT}
                        onClick={generateTask}
                        className={`p-1.5 rounded-md bg-zinc-900 text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 ease-in-out`}
                      >
                        {loadingT ? (
                          <Loader2 size={20} className="mx-auto animate-spin" />
                        ) : (
                          <BookmarkCheck size={20} />
                        )}
                      </button>
                    </Tooltip>
                  </div>
                </>
              )}
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
                  {diagTitle
                    ? `Gabarito ${diagTitle}`
                    : `Avaliação do Diagnóstico`}
                </h2>
                {data && (
                  <>
                    <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      {data.questions &&
                        data.questions.map((x: any, k: number) => (
                          <>
                            <div className="sm:col-span-6 flex justify-between items-center">
                              <div>
                                <label
                                  htmlFor="name"
                                  className="block text-sm font-medium leading-6 text-zinc-900"
                                >
                                  {x.title}
                                </label>
                                <div className="mt-2 text-sm font-bold">
                                  <label className="flex items-center gap-x-2">
                                    {data.client_answers[0].response[k] &&
                                      data.client_answers[0].score > 0 && (
                                        <input
                                          type="checkbox"
                                          checked={
                                            tasks.filter(
                                              (_x: any) =>
                                                _x.question === x.title
                                            ).length >= 1
                                          }
                                          onClick={() =>
                                            handleTask({
                                              question: x.title,
                                              answer:
                                                data.client_answers[0].response[
                                                  k
                                                ]
                                            })
                                          }
                                        />
                                      )}
                                    {data.client_answers
                                      ? data.client_answers[0].response[k]
                                      : `...`}
                                  </label>
                                </div>
                              </div>
                              <div className="flex justify-end items-center gap-x-2 font-bold">
                                {data.questions &&
                                data.questions[k].answers.length <= 0 ? (
                                  <>
                                    {data.questions &&
                                      data.questions[k].answers.length <= 0 && (
                                        <>
                                          <Tooltip text="Baixa">
                                            <button
                                              onClick={() =>
                                                checkGabarito(k, 3)
                                              }
                                              disabled={
                                                data.client_answers[0].score > 0
                                              }
                                              className={`p-1.5 rounded-md ${
                                                gabarito[k] && gabarito[k] === 3
                                                  ? `bg-emerald-500 text-white hover:bg-emerald-600`
                                                  : `bg-black/5 text-emerald-500 hover:bg-black/10`
                                              } disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 ease-in-out`}
                                            >
                                              <CheckCircle2 size={20} />
                                            </button>
                                          </Tooltip>
                                          <Tooltip text="Média">
                                            <button
                                              onClick={() =>
                                                checkGabarito(k, 2)
                                              }
                                              disabled={
                                                data.client_answers[0].score > 0
                                              }
                                              className={`p-1.5 rounded-md ${
                                                gabarito[k] && gabarito[k] === 2
                                                  ? `bg-protectdata-500 text-white hover:bg-protectdata-600`
                                                  : `bg-black/5 text-protectdata-500 hover:bg-black/10`
                                              } disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 ease-in-out`}
                                            >
                                              <AlertCircle size={20} />
                                            </button>
                                          </Tooltip>
                                          <Tooltip text="Urgente">
                                            <button
                                              onClick={() =>
                                                checkGabarito(k, 1)
                                              }
                                              disabled={
                                                data.client_answers[0].score > 0
                                              }
                                              className={`p-1.5 rounded-md ${
                                                (gabarito[k] &&
                                                  gabarito[k] === 1) ||
                                                data.client_answers[0].response[
                                                  k
                                                ] === 1
                                                  ? `bg-red-500 text-white hover:bg-red-600`
                                                  : `bg-black/5 text-red-500 hover:bg-black/10`
                                              } disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 ease-in-out`}
                                            >
                                              <AlertOctagon size={20} />
                                            </button>
                                          </Tooltip>
                                        </>
                                      )}
                                  </>
                                ) : (
                                  <>
                                    <Tooltip text="Baixa">
                                      <button
                                        disabled
                                        className={`p-1.5 rounded-md ${
                                          getScoreFromAnswer(
                                            k,
                                            data.client_answers[0].response[k]
                                          ) === 3
                                            ? `bg-emerald-500 text-white hover:bg-emerald-600`
                                            : `bg-black/5 text-emerald-500 hover:bg-black/10`
                                        } disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 ease-in-out`}
                                      >
                                        <CheckCircle2 size={20} />
                                      </button>
                                    </Tooltip>
                                    <Tooltip text="Média">
                                      <button
                                        disabled
                                        className={`p-1.5 rounded-md ${
                                          getScoreFromAnswer(
                                            k,
                                            data.client_answers[0].response[k]
                                          ) === 2
                                            ? `bg-protectdata-500 text-white hover:bg-protectdata-600`
                                            : `bg-black/5 text-protectdata-500 hover:bg-black/10`
                                        } disabled:cursor-not-allowed opacity-50 transition duration-300 ease-in-out`}
                                      >
                                        <AlertCircle size={20} />
                                      </button>
                                    </Tooltip>
                                    <Tooltip text="Urgente">
                                      <button
                                        disabled
                                        className={`p-1.5 rounded-md ${
                                          getScoreFromAnswer(
                                            k,
                                            data.client_answers[0].response[k]
                                          ) === 1
                                            ? `bg-red-500 text-white hover:bg-red-600`
                                            : `bg-black/5 text-red-500 hover:bg-black/10`
                                        } disabled:cursor-not-allowed opacity-50 transition duration-300 ease-in-out`}
                                      >
                                        <AlertOctagon size={20} />
                                      </button>
                                    </Tooltip>
                                  </>
                                )}
                              </div>
                            </div>
                          </>
                        ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div>
                {data &&
                  data.client_answers &&
                  data.client_answers[0].score > 0 && (
                    <div className="">
                      <label
                        htmlFor="score"
                        className="block text-sm font-medium leading-6 text-zinc-900"
                      >
                        Nota Final
                      </label>
                      <div className="flex justify-start items-center text-md gap-x-0 font-base">
                        <strong
                          className={`text-lg ${
                            data.client_answers.length
                              ? data.client_answers[0].score <= 20
                                ? `text-red-500`
                                : data.client_answers[0].score <= 75
                                ? `text-yellow-500`
                                : `text-emerald-500`
                              : ``
                          }`}
                        >
                          {data.client_answers
                            ? data.client_answers[0].score
                            : 0}
                        </strong>
                        /100
                      </div>
                    </div>
                  )}
              </div>
              <div className="flex items-center justify-end gas-x-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex disabled:cursor-not-allowed disabled:opacity-50 w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 sm:mt-0 sm:w-auto"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={
                    loading ||
                    (data.client_answers &&
                      data.client_answers.length > 0 &&
                      data.client_answers[0].score > 0)
                  }
                  onClick={handleRate}
                  className={`inline-flex disabled:cursor-not-allowed disabled:opacity-50 w-full justify-center rounded-md bg-emerald-600 hover:bg-emerald-500 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto`}
                >
                  {loading ? (
                    <Loader2 size={20} className="mx-auto animate-spin" />
                  ) : (
                    `Avaliar`
                  )}
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
