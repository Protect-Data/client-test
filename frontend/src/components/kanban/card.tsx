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
import { useEffect, useRef, useState } from "react";
import { useDrag } from "react-dnd";
import ModalTaskDetail from "../tasks/ModalTask";
import { useRouter, useSearchParams } from "next/navigation";

export default function Card({
  data,
  onUpdate
}: {
  data: any;
  onUpdate: () => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");
  const [modalTask, setModalTask] = useState<any>(null);
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CARD",
    item: data,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));
  drag(ref);

  useEffect(() => {
    if (data && taskId && data.id === taskId) {
      setModalTask(data);
    }
  }, [data, taskId]);

  return (
    <>
      <div
        ref={ref}
        className={`p-4 bg-white rounded-lg transition-transform duration-150 ease-in-out ${
          isDragging ? "scale-105 opacity-100 z-10 shadow-xl" : "shadow-md"
        }`}
      >
        <div className="w-full flex justify-between items-center">
          <span
            onClick={() => setModalTask(data)}
            className="text-base font-semibold cursor-pointer flex items-center gap-x-2"
          >
            {data.privacy === "private" && <Lock size={16} />}
            {data.title}
          </span>
          <div>
            <button
              onClick={() => setModalTask(data)}
              className="p-2 bg-zinc-200 hover:bg-zinc-300 rounded-md transition duration-300 ease-in-out"
            >
              <ExternalLink size={12} />
            </button>
          </div>
        </div>
        <div className="w-full pt-2 text-zinc-500">
          {data.description && data.description !== ""
            ? `${data.description.substring(0, 160)}${
                data.description.length > 160 ? `...` : ``
              }`
            : "Descrição vazia."}
        </div>
        <div className="w-full mt-4 flex flex-col xl:flex-row gap-y-4 justify-between items-center">
          <div className="flex items-center gap-x-4 font-medium text-xs text-zinc-600">
            <span className="flex items-center gap-x-1">
              <CheckSquare2 size={12} /> {data.checklist.length} Checklist
            </span>
            <span className="flex items-center gap-x-1">
              <MessageCircle size={12} /> {data.comments.length} Comentário
              {data.comments.length !== 1 ? `s` : null}
            </span>
            <span className="flex items-center gap-x-1">
              <Paperclip size={12} /> {data.files.length} Anexo
              {data.files.length !== 1 ? `s` : null}
            </span>
          </div>
          <span className="flex items-center justify-center gap-x-2 w-full xl:w-auto bg-protectdata-500/20 p-2 px-3 text-xs font-medium rounded-md">
            <Clock size={12} /> {dayjs(data.created_at).format("DD/MM HH:mm")}
          </span>
        </div>
      </div>
      <ModalTaskDetail
        open={modalTask ? true : false}
        setOpen={() => {
          setModalTask(false);
          router.replace("/dashboard/tasks");
        }}
        data={modalTask}
        handleUpdate={onUpdate}
      />
    </>
  );
}
