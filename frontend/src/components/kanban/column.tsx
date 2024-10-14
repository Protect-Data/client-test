"use client";

import { useDrop } from "react-dnd";
import Card from "./card";
import { useRef, useState } from "react";
import { AlertTriangle, ClipboardList, PlusIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import DrawerAddTask from "../tasks/DrawerAddTask";

const Column = ({
  status,
  cards,
  moveCard,
  onUpdate
}: {
  status: string;
  cards: any;
  moveCard: any;
  onUpdate: () => void;
}) => {
  const { data: session }: any = useSession();
  const [modalAdd, setModalAdd] = useState<boolean>(false);

  const indexStatus =
    status === "Em Progresso" ? 1 : status === "Finalizado" ? 2 : 0;

  const getStatusKey = (status: string) => {
    return status === "Em Progresso" ? 1 : status === "Finalizado" ? 2 : 0;
  };

  const ref = useRef(null);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "CARD",
    drop: (item: any) => {
      moveCard(item.id, getStatusKey(status));
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));
  drop(ref);

  return (
    <>
      <div
        ref={ref}
        className="flex flex-col w-auto md:border-r-2 pt-8 md:pt-0 md:pr-4 last:border-none h-full col-span-1"
      >
        <h2 className="text-xl font-semibold flex items-center gap-x-3">
          <span className="text-sm font-semibold p-2 shadow-sm select-none rounded-full border-2 border-zinc-300 text-zinc-600 w-8 h-8 flex justify-center items-center">
            {status === "Em Progresso" ? 2 : status === "Finalizado" ? 3 : 1}
          </span>
          {status}
        </h2>
        <ul className="mt-8 w-full space-y-4">
          {!cards || cards.length <= 0 ? (
            <>
              <div className="text-center w-full py-8 md:py-24 lg:py-32">
                <ClipboardList className="mx-auto h-12 w-12 text-zinc-400" />
                <h3 className="mt-2 text-sm font-semibold text-zinc-900">
                  Sem registros
                </h3>
                <p className="mt-1 text-sm text-zinc-500">
                  {`Lista ${status} Vazia.`}
                </p>
              </div>
            </>
          ) : (
            cards &&
            cards.map((card: any) => (
              <Card key={card.id} data={card} onUpdate={onUpdate} />
            ))
          )}
        </ul>
        {session && session.manager && (
          <button
            onClick={() => setModalAdd(true)}
            className={`w-full border-2 text-zinc-400 hover:bg-zinc-200/70 font-semibold border-zinc-200 hover:border-zinc-400 hover:text-black text-sm border-dashed rounded-md p-2 flex justify-center items-center ${
              cards.length >= 1 ? `mt-4` : ``
            } gap-x-2 transition duration-300 ease-in-out`}
          >
            <PlusIcon size={16} />
            Nova Tarefa
          </button>
        )}
      </div>
      <DrawerAddTask
        open={modalAdd}
        defaultStatus={indexStatus}
        setOpen={setModalAdd}
        onAdded={() => {
          onUpdate();
          setModalAdd(false);
        }}
      />
    </>
  );
};

export default Column;
