"use client";

import dayjs from "dayjs";
import {
  CheckSquare2,
  Clock,
  ExternalLink,
  Lock,
  MessageCircle,
  Paperclip
} from "lucide-react";
import React, { useState } from "react";
import { ReactSortable } from "react-sortablejs";

function Column({
  status,
  cards,
  moveCard
}: {
  status: string;
  cards: any;
  moveCard: (e: any) => void;
}) {
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
          {cards.map((item: any) => (
            <Card key={item.id} item={item} />
          ))}
        </ReactSortable>
      </div>
    </>
  );
}

function Card({ item }: any) {
  return (
    <div className="p-4 bg-white border border-zinc-200 shadow-md rounded-lg transition-transform duration-150 ease-in-out">
      <div className="w-full flex justify-between items-center">
        <span
          // onClick={() => setModalTask(item)}
          className="text-base font-semibold cursor-pointer flex items-center gap-x-2"
        >
          {item.privacy === "private" && <Lock size={16} />}
          {item.title}
        </span>
        <div>
          <button
            // onClick={() => setModalTask(item)}
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
  );
}

export default function KanbanV2({
  data,
  handleReorder
}: {
  data: any;
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
            moveCard={(newList: any) => {
              handleReorder(x.title, newList);
            }}
          />
        ))}
    </div>
  );
}