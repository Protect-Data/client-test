"use client";

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Dialog,
  DialogPanel,
  DialogBackdrop
} from "@headlessui/react";
import axios from "axios";
import { FrownIcon, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SearchPallete({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: (e: boolean) => void;
}) {
  const [query, setQuery] = useState<string>("");
  const [items, setItems] = useState<any>([]);
  const router = useRouter();

  const filteredItems = query === "" ? [] : [...items];

  const groups = filteredItems.reduce((groups: any, item: any) => {
    return {
      ...groups,
      [item.category]: [...(groups[item.category] || []), item]
    };
  }, {});

  useEffect(() => {
    if (query.length > 0) {
      handleSearchDb(query);
    } else {
      setItems([]);
    }
  }, [query]);

  const handleSearchDb = async (term: string) => {
    try {
      const { data: query }: any = await axios.post(`/api/v1/search`, {
        term
      });
      if (query.error) {
        toast.error(query.error);
        return false;
      }
      setItems([...query]);
    } catch (error) {
      console.error("getTasksList"), error;
      toast.error(`Falha ao atualizar tarefa.`);
    }
  };

  const handleGoTo = (item: any) => {
    if (item.category === "Tarefas") {
      router.push(`/dashboard/tasks?taskId=${item.id}`);
      setOpen(false);
    } else {
      return false;
    }
  };

  return (
    <Dialog
      transition
      className="relative z-50"
      open={open}
      onClose={() => {
        setOpen(false);
        setQuery("");
      }}
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-zinc-600 bg-opacity-25 backdrop-blur-lg transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
        <DialogPanel
          transition
          className="mx-auto max-w-xl transform overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        >
          <Combobox
            onChange={(item: any) => {
              if (item) {
                window.location = item.url;
              }
            }}
          >
            <div className="relative">
              <SearchIcon
                className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-zinc-400"
                aria-hidden="true"
              />
              <ComboboxInput
                autoFocus
                className="h-12 w-full border-0 bg-transparent pl-11 outline-none pr-4 text-zinc-900 placeholder:text-zinc-400 focus:ring-0 sm:text-sm"
                placeholder="Pesquisar por palavra-chave..."
                onChange={(event) => setQuery(event.target.value)}
                onBlur={() => setQuery("")}
              />
            </div>

            {query === "" && (
              <div className="border-t border-zinc-100 px-6 py-14 text-center text-sm sm:px-14">
                <SearchIcon
                  className="mx-auto h-6 w-6 text-zinc-400"
                  aria-hidden="true"
                />
                <p className="mt-4 font-semibold text-zinc-900">
                  Buscar na Protect Data
                </p>
                <p className="mt-2 text-zinc-500">
                  Pesquisar por tarefas, documentos, comentários, usuários...
                </p>
              </div>
            )}

            {filteredItems.length > 0 && (
              <ComboboxOptions
                static
                as="ul"
                className="max-h-80 scroll-pb-2 scroll-pt-11 space-y-2 overflow-y-auto pb-2"
              >
                {Object.entries(groups).map(([category, items]: any) => (
                  <li key={category}>
                    <h2 className="bg-zinc-100 px-4 py-2.5 text-xs font-semibold text-zinc-900">
                      {category}
                    </h2>
                    <ul className="mt-2 text-sm text-zinc-800">
                      {items.map((item: any) => (
                        <ComboboxOption
                          key={item.id}
                          value={item}
                          className="cursor-default select-none px-4 py-2 data-[focus]:bg-zinc-600 data-[focus]:text-white"
                        >
                          {item.title}
                        </ComboboxOption>
                      ))}
                    </ul>
                  </li>
                ))}
              </ComboboxOptions>
            )}

            {query !== "" && filteredItems.length === 0 && (
              <div className="border-t border-zinc-100 px-6 py-14 text-center text-sm sm:px-14">
                <FrownIcon
                  className="mx-auto h-6 w-6 text-zinc-400"
                  aria-hidden="true"
                />
                <p className="mt-4 font-semibold text-zinc-900">
                  Nada foi encontrado
                </p>
                <p className="mt-2 text-zinc-500">
                  Sentimos muito, mas não encontramos nada relacionado à sua
                  busca.
                </p>
              </div>
            )}
          </Combobox>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
