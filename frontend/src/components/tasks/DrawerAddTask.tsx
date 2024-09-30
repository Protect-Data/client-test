"use client";

import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { ExternalLink, Info, Loader2, Plus, X } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import axios from "axios";

const team = [
  {
    name: "Tom Cook",
    email: "tom.cook@example.com",
    href: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "Whitney Francis",
    email: "whitney.francis@example.com",
    href: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "Leonard Krasner",
    email: "leonard.krasner@example.com",
    href: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "Floyd Miles",
    email: "floyd.miles@example.com",
    href: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    name: "Emily Selman",
    email: "emily.selman@example.com",
    href: "#",
    imageUrl:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  }
];

type FormSchema = {
  title: string;
  description: string;
  privacy: "public" | "private";
};

const formSchema = z.object({
  title: z.string().min(3, "Informe um título válido para a tarefa"),
  description: z.string(),
  privacy: z.string().default("public")
});

export default function DrawerAddTask({
  open,
  setOpen,
  onAdded,
  defaultStatus
}: {
  open: boolean;
  setOpen: (e: boolean) => void;
  onAdded: () => void;
  defaultStatus?: number;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema)
  });

  const [loading, setLoading] = useState(false);

  const handleAddTask = async (data: any) => {
    setLoading(true);
    try {
      const { data: query } = await axios.post("/api/v1/tasks", {
        ...data,
        status: defaultStatus
      });
      if (query.error) {
        setLoading(false);
        toast.error(query.error);
        return false;
      }
      toast.success("Tarefa adicionada com sucesso!");
      onAdded();
      reset();
      setLoading(false);
      console.log("handleLogin", query);
    } catch (err: any) {
      setLoading(false);
      toast.error(`Falha ao adicionar tarefa`);
      console.log("[handleLoginError]", err);
    }
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-40">
      <div className="fixed bg-black/50 backdrop-blur-md inset-0" />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-2xl transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <form
                onSubmit={handleSubmit(handleAddTask)}
                className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl"
              >
                <div className="flex-1">
                  <div className="bg-gray-50 px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between space-x-3">
                      <div className="space-y-1">
                        <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
                          Nova tarefa [
                          {defaultStatus === 0
                            ? `A Fazer`
                            : defaultStatus === 1
                            ? `Em Progresso`
                            : `Finalizado`}
                          ]
                        </DialogTitle>
                      </div>
                      <div className="flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="relative text-gray-400 hover:text-gray-500"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <X aria-hidden="true" className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
                    <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                      <div>
                        <label
                          htmlFor="project-name"
                          className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                        >
                          Nome da Tarefa
                        </label>
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          {...register("title")}
                          type="text"
                          placeholder="ex.: Teste de Vulnerabilidade"
                          className="block w-full rounded-md outline-none px-2 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                      <div>
                        <label
                          htmlFor="project-description"
                          className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5"
                        >
                          Descrição
                        </label>
                      </div>
                      <div className="sm:col-span-2">
                        <textarea
                          {...register("description")}
                          rows={3}
                          placeholder="ex.: Realizaremos 3 testes de vulnerabilidade no sistema em questão."
                          className="block w-full rounded-md outline-none px-2 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm sm:leading-6"
                          defaultValue={""}
                        />
                      </div>
                    </div>

                    {/*<div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                      <div>
                        <h3 className="text-sm font-medium leading-6 text-gray-900">
                          Membros
                        </h3>
                      </div>
                      <div className="sm:col-span-2">
                        <div className="flex space-x-2">
                          {team.map((person) => (
                            <a
                              key={person.email}
                              href={person.href}
                              className="flex-shrink-0 rounded-full hover:opacity-75"
                            >
                              <img
                                alt={person.name}
                                src={person.imageUrl}
                                className="inline-block h-8 w-8 rounded-full"
                              />
                            </a>
                          ))}

                          <button
                            type="button"
                            className="relative inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
                          >
                            <span className="absolute -inset-2" />
                            <span className="sr-only">Add team member</span>
                            <Plus aria-hidden="true" className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>*/}

                    <fieldset className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                      <legend className="sr-only">Privacy</legend>
                      <div
                        aria-hidden="true"
                        className="text-sm font-medium leading-6 text-gray-900"
                      >
                        Privacy
                      </div>
                      <div className="space-y-5 sm:col-span-2">
                        <div className="space-y-5 sm:mt-0">
                          <div className="relative flex items-start">
                            <div className="absolute flex h-6 items-center">
                              <input
                                defaultChecked
                                {...register("privacy")}
                                value="public"
                                type="radio"
                                className="h-4 w-4 border-gray-300 text-zinc-600 focus:ring-zinc-600"
                              />
                            </div>
                            <div className="pl-7 text-sm leading-6">
                              <label
                                htmlFor="public-access"
                                className="font-medium text-gray-900"
                              >
                                Público
                              </label>
                              <p
                                id="public-access-description"
                                className="text-gray-500"
                              >
                                Todos têm acesso à tarefa.
                              </p>
                            </div>
                          </div>
                          <div className="relative flex items-start">
                            <div className="absolute flex h-6 items-center">
                              <input
                                {...register("privacy")}
                                value="private"
                                type="radio"
                                className="h-4 w-4 border-gray-300 text-zinc-600 focus:ring-zinc-600"
                              />
                            </div>
                            <div className="pl-7 text-sm leading-6">
                              <label
                                htmlFor="private-access"
                                className="font-medium text-gray-900"
                              >
                                Privado
                              </label>
                              <p
                                id="private-access-description"
                                className="text-gray-500"
                              >
                                Somente administradores têm acesso.
                              </p>
                            </div>
                          </div>
                        </div>
                        <hr className="border-gray-200" />
                        <div className="flex flex-col items-start space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                          <div>
                            <button className="group flex items-center space-x-2.5 text-sm text-gray-500 hover:text-gray-900">
                              <Info
                                aria-hidden="true"
                                className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                              />
                              <span>
                                Tarefas privadas não são visíveis ao usuário
                                comum.
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => setOpen(false)}
                      className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex justify-center rounded-md bg-zinc-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600"
                    >
                      {loading ? (
                        <Loader2 size={20} className="mx-auto animate-spin" />
                      ) : (
                        `Adicionar Tarefa`
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
