"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, Switch } from "@headlessui/react";
import {
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

const actions = [
  {
    title: "Request time off",
    href: "#",
    icon: Trash2,
    iconForeground: "text-teal-700",
    iconBackground: "bg-teal-50"
  },
  {
    title: "Benefits",
    href: "#",
    icon: Trash2,
    iconForeground: "text-purple-700",
    iconBackground: "bg-purple-50"
  }
];

export default function ModalDiagnostic({
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
    title: "",
    questions: []
  });

  useEffect(() => {
    if (open) {
      if (edit) {
        setForm({
          ...form,
          title: edit.title,
          questions: edit.questions
        });
      } else {
        setForm({ title: "", questions: [] });
      }
    }
  }, [open, edit]);

  const handleAdd = async () => {
    if (form.title == "" || form.questions.length <= 0) {
      toast.error("Não deixe campos em branco");
      return false;
    }
    setLoading(true);
    try {
      const { data: query } = await axios.post("/api/v1/diagnostics", {
        ...form
      });
      if (query.error) {
        toast.error(query.error);
        return false;
      }
      onAdded();
      setOpen(false);
      toast.success("Diagnóstico adicionado com sucesso!");
    } catch (error: any) {
      console.error("handleAdd", error);
      toast.error(error.message || `Erro ao adicionar diagnóstico.`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (form.title == "" || form.questions.length <= 0) {
      toast.error("Não deixe campos em branco");
      return false;
    }
    setLoading(true);
    try {
      const { data: query } = await axios.put("/api/v1/diagnostics", {
        id: edit.id,
        ...form
      });
      if (query.error) {
        toast.error(query.error);
        return false;
      }
      onAdded();
      setOpen(false);
      toast.success("Diagnóstico atualizado com sucesso!");
    } catch (error: any) {
      console.error("handleAdd", error);
      toast.error(error.message || `Erro ao atualizar diagnóstico.`);
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

  const handleDeleteQuestion = (questIndex: number) => {
    if (!window.confirm("Remover a questão da lista?")) {
      toast.error(`Ação cancelada...`);
      return false;
    }
    let backup = [...form.questions];
    backup.splice(questIndex, 1);
    setForm({ ...form, questions: backup });
  };

  const handleAddAnswer = (questIndex: number) => {
    let backup = [...form.questions];
    backup[questIndex].answers.push({
      title: "",
      score: 1
    });
    setForm({ ...form, questions: backup });
  };

  const handleDeleteAnswer = (questIndex: number, ansIndex: number) => {
    if (!window.confirm("Remover a resposta da lista?")) {
      toast.error(`Ação cancelada...`);
      return false;
    }
    let backup = [...form.questions];
    backup[questIndex].answers.splice(ansIndex, 1);
    setForm({ ...form, questions: backup });
  };

  const handleEditQuest = (questIndex: number, text: string) => {
    let backup = [...form.questions];
    backup[questIndex].title = text;
    setForm({ ...form, questions: backup });
  };

  const handleEditQuestAnswer = (
    questIndex: number,
    ansIndex: number,
    text: string
  ) => {
    let backup = [...form.questions];
    backup[questIndex].answers[ansIndex].title = text;
    setForm({ ...form, questions: backup });
  };

  const handleEditQuestAnswerScore = (
    questIndex: number,
    ansIndex: number,
    text: number
  ) => {
    let backup = [...form.questions];
    backup[questIndex].answers[ansIndex].score = text;
    setForm({ ...form, questions: backup });
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
                  {edit ? `Editar` : remove ? `Excluir` : `Adicionar`}{" "}
                  Diagnóstico
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
                  <>
                    <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <div className="sm:col-span-6">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium leading-6 text-zinc-900"
                        >
                          Título
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="title"
                            value={form.title}
                            disabled={loading}
                            onChange={(e: any) =>
                              setForm({ ...form, title: e.target.value })
                            }
                            className="block w-full rounded-md border-0 py-1.5 px-2 outline-none text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                        <button
                          onClick={() =>
                            setForm({
                              ...form,
                              questions: [
                                ...form.questions,
                                {
                                  title: "",
                                  score: 1,
                                  answers: [
                                    /*{
                                      title: "",
                                      score: 1
                                    }*/
                                  ]
                                }
                              ]
                            })
                          }
                          disabled={form.title === ""}
                          className="w-full mt-4 bg-zinc-900 hover:bg-zinc-700 text-white py-2 rounded-lg flex justify-center items-center gap-x-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Plus size={16} />
                          Adicionar Questão
                        </button>
                      </div>

                      {form.questions.map((x: any, k: number) => (
                        <div
                          key={k}
                          className="sm:col-span-6 border-t pt-4 -mt-4"
                        >
                          <div className="sm:grid sm:grid-cols-12 sm:items-start sm:gap-4 items-center pb-1">
                            <label
                              htmlFor="username"
                              className="block sm:col-span-1 pl-2 font-medium leading-6 text-zinc-500 text-center sm:pt-1.5"
                            >
                              #{k + 1}
                            </label>
                            <div className="mt-2 sm:col-span-9 sm:mt-0">
                              <input
                                id="username"
                                name="username"
                                type="text"
                                value={x.title}
                                placeholder={`Questão #${k + 1}`}
                                onChange={(e: any) =>
                                  handleEditQuest(k, e.target.value)
                                }
                                className="block w-full max-w-2xl rounded-md border-0 py-1.5 px-2 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                              />
                            </div>
                            <div className="mt-2 sm:col-span-2 sm:mt-0 pt-2 flex justify-center items-center gap-x-3">
                              <Tooltip text="Opções">
                                <button
                                  onClick={() => handleAddAnswer(k)}
                                  className="text-emerald-500 hover:opacity-100 opacity-75"
                                >
                                  <CheckSquare2 size={20} />
                                </button>
                              </Tooltip>
                              <Tooltip text="Remover">
                                <button
                                  onClick={() => handleDeleteQuestion(k)}
                                  className="text-red-500 hover:opacity-100 opacity-75"
                                >
                                  <Trash2 size={20} />
                                </button>
                              </Tooltip>
                            </div>
                          </div>
                          {x.answers.map((_x: any, _k: number) => (
                            <div
                              key={_k}
                              className="p-1 mx-2 border-l-4 border-black/10 bg-zinc-200 rounded-lg mt-1 w-auto sm:grid sm:grid-cols-12 sm:items-start sm:gap-2 items-center text-sm"
                            >
                              <div className="mt-2 sm:col-span-10 sm:mt-0 flex items-center gap-x-2">
                                <input
                                  id="username"
                                  name="username"
                                  type="text"
                                  value={_x.title}
                                  placeholder={`Resposta #${_k + 1}`}
                                  onChange={(e: any) =>
                                    handleEditQuestAnswer(k, _k, e.target.value)
                                  }
                                  className="block w-full rounded-md border-0 py-1.5 px-2 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                />
                                <span className="pl-4 opacity-50">Peso</span>
                                <input
                                  name="score"
                                  type="number"
                                  min={1}
                                  max={x.answers.length}
                                  value={_x.score}
                                  onChange={(e: any) =>
                                    handleEditQuestAnswerScore(
                                      k,
                                      _k,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Pontos"
                                  className="w-10 rounded-md border-0 py-1.5 px-2 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                />
                              </div>
                              <div className="mt-2 sm:col-span-2 sm:mt-0 flex justify-center items-center gap-x-2 pt-2">
                                <Tooltip text="Remover">
                                  <button
                                    onClick={() => handleDeleteAnswer(k, _k)}
                                    className="text-red-500 hover:opacity-100 opacity-45"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </Tooltip>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                disabled={loading || form.questions.length <= 0}
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
                  `Adicionar`
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
