"use client";

import dayjs from "dayjs";
import {
  CheckSquare2,
  ClipboardList,
  Clock,
  ExternalLink,
  Lock,
  MessageCircle,
  Paperclip,
  PlusIcon
} from "lucide-react";
import React, { useState } from "react";
import { ReactSortable } from "react-sortablejs";
import ModalTaskDetail from "../tasks/ModalTask";
import { useSession } from "next-auth/react";
import DrawerAddTask from "../tasks/DrawerAddTask";

function Column({
  status,
  cards,
  onUpdate,
  moveCard
}: {
  status: string;
  cards: any;
  onUpdate: () => void;
  moveCard: (e: any) => void;
}) {
  const { data: session }: any = useSession();
  const [modalAdd, setModalAdd] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-x-3">
          <span className="text-sm font-semibold p-2 shadow-sm select-none rounded-full border-2 border-zinc-300 text-zinc-600 w-8 h-8 flex justify-center items-center">
            {status === "Em Progresso" ? 2 : status === "Finalizado" ? 3 : 1}
          </span>
          {status}
        </h2>
        <ReactSortable
          list={cards}
          setList={moveCard}
          animation={200}
          group="cards"
          // onChange={(order, sortable, evt) => {
          //   console.log("onChange", order, sortable, evt);
          // }}
          // onEnd={(evt) => {
          //   console.log("onEnd", evt);
          // }}
          className="space-y-4"
        >
          {!cards || cards.length <= 0 ? (
            <div className="text-center w-full py-5">
              <ClipboardList className="mx-auto h-12 w-12 text-zinc-400" />
              <h3 className="mt-2 text-sm font-semibold text-zinc-900">
                Sem registros
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                {`Lista ${status} Vazia.`}
              </p>
            </div>
          ) : (
            cards.map((item: any) => (
              <Card key={item.id} item={item} onUpdate={onUpdate} />
            ))
          )}
        </ReactSortable>
        {session && session.manager && (
          <>
            <button
              onClick={() => setModalAdd(true)}
              className="w-full border-2 text-zinc-400 hover:bg-zinc-200 font-semibold border-dashed rounded-md p-2 flex justify-center items-center mt-4 gap-x-2 transition duration-300 ease-in-out"
            >
              <PlusIcon size={16} />
              Nova Tarefa
            </button>
            <DrawerAddTask
              open={modalAdd}
              defaultStatus={
                status === "Em Progresso" ? 1 : status === "Finalizado" ? 2 : 0
              }
              setOpen={setModalAdd}
              onAdded={() => {
                onUpdate();
                setModalAdd(false);
              }}
            />
          </>
        )}
      </div>
    </>
  );
}

function Card({ item, onUpdate }: any) {
  const [modalTask, setModalTask] = useState<any>(null);

  return (
    <>
      <div className="p-4 bg-white border border-zinc-200 shadow-md rounded-lg transition-transform duration-150 ease-in-out">
        <div className="w-full flex justify-between items-center">
          <span
            onClick={() => setModalTask(item)}
            className="text-base font-semibold cursor-pointer flex items-center gap-x-2"
          >
            {item.privacy === "private" && <Lock size={16} />}
            {item.title}
          </span>
          <div>
            <button
              onClick={() => setModalTask(item)}
              className="p-2 bg-zinc-200 hover:bg-zinc-300 rounded-md transition duration-300 ease-in-out"
            >
              <ExternalLink size={12} />
            </button>
          </div>
        </div>
        <div className="w-full pt-2 text-zinc-500">
          {item.description && item.description !== ""
            ? `${item.description.substring(0, 160)}${
                item.description.length > 160 ? `...` : ``
              }`
            : "Descrição vazia."}
        </div>
        <div className="w-full mt-4 flex flex-col xl:flex-row gap-y-4 justify-between items-center">
          <div className="flex items-center gap-x-4 font-medium text-xs text-zinc-600">
            <span className="flex items-center gap-x-1">
              <CheckSquare2 size={12} /> {item.checklist.length} Checklist
            </span>
            <span className="flex items-center gap-x-1">
              <MessageCircle size={12} /> {item.comments.length} Comentário
              {item.comments.length !== 1 ? `s` : null}
            </span>
            <span className="flex items-center gap-x-1">
              <Paperclip size={12} /> {item.files.length} Anexo
              {item.files.length !== 1 ? `s` : null}
            </span>
          </div>
          <span className="flex items-center justify-center gap-x-2 w-full xl:w-auto bg-protectdata-500/20 p-2 px-3 text-xs font-medium rounded-md">
            <Clock size={12} /> {dayjs(item.created_at).format("DD/MM HH:mm")}
          </span>
        </div>
      </div>
      <ModalTaskDetail
        open={modalTask ? true : false}
        setOpen={() => {
          setModalTask(false);
        }}
        data={modalTask}
        handleUpdate={onUpdate}
      />
    </>
  );
}

export default function KanbanV2({
  data,
  handleReorder,
  onUpdate
}: {
  data: any;
  onUpdate: () => void;
  handleReorder: (status: string, list: any) => void;
}) {
  return (
    <div className="w-full min-h-[84vh] h-full grid grid-cols-1 xl:grid-cols-3 gap-x-4 gap-y-8">
      {data &&
        data.map((x: any, k: number) => (
          <Column
            key={k}
            status={x.title}
            cards={x.list}
            onUpdate={onUpdate}
            moveCard={(newList: any) => {
              handleReorder(x.title, newList);
            }}
          />
        ))}
    </div>
  );
}
