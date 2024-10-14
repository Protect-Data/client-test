"use client";

import DashboardLayout from "@/components/dashboardLayout";
import KanbanBoard from "@/components/kanban/board";
import DndProviderWrapper from "@/components/kanban/provider";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function TasksPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [tasks, setTasks] = useState<any>(null);
  const [kanban, setKanban] = useState<any>(null);

  useEffect(() => {
    if (!tasks) getTasksList();
  }, [tasks]);

  const getTasksList = async () => {
    // setLoading(true);
    try {
      const { data: _tasks } = await axios.get("/api/v1/tasks");
      setTasks(_tasks);
      setKanban([
        {
          title: "A Fazer",
          list: _tasks ? [..._tasks.filter((x: any) => x.status === 0)] : []
        },
        {
          title: "Em Progresso",
          list: _tasks ? [..._tasks.filter((x: any) => x.status === 1)] : []
        },
        {
          title: "Finalizado",
          list: _tasks ? [..._tasks.filter((x: any) => x.status === 2)] : []
        }
      ]);
    } catch (error) {
      console.error("getTasksList"), error;
      toast.error(`Falha ao recuperar as tarefas.`);
      setKanban([
        {
          title: "A Fazer",
          list: []
        },
        {
          title: "Em Progresso",
          list: []
        },
        {
          title: "Finalizado",
          list: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = (e: any) => {
    setKanban(e);
  };

  return (
    <>
      <DashboardLayout>
        {loading ? (
          <>
            <div
              className={`w-full min-h-screen h-full grid grid-cols-1 md:grid-cols-3 gap-x-4`}
            >
              {[0, 0, 0].map((x: any, k: number) => (
                <div
                  key={k}
                  className="flex flex-col w-auto border-r-2 pt-8 md:pt-0 md:pr-4 last:border-none h-full col-span-1 animate-pulse"
                >
                  <h2 className="text-xl font-semibold flex items-center gap-x-3">
                    <span className="text-sm font-semibold p-2 shadow-sm select-none rounded-full border-2 border-zinc-300 text-zinc-600 w-8 h-8 flex justify-center items-center" />
                    <div className="w-44 h-6 bg-zinc-200 rounded-md" />
                  </h2>
                  <ul className="mt-8 w-full space-y-4">
                    {[0, 0, 0, 0].map((_x: any, _k: number) => (
                      <li
                        key={_k}
                        className="w-full bg-white shadow-lg border text-sm p-2.5 px-4 rounded-md"
                      >
                        <div className="w-full flex justify-between items-center">
                          <div className="w-44 h-6 bg-zinc-200 rounded-md" />
                          <div className="w-6 h-6 bg-zinc-200 rounded-md" />
                        </div>
                        <div className="my-1 space-y-1">
                          <div className="w-full h-6 bg-zinc-200 rounded-md" />
                          <div className="w-44 h-6 bg-zinc-200 rounded-md" />
                          <div className="w-32 h-6 bg-zinc-200 rounded-md" />
                        </div>
                        <div className="w-full mt-4 flex flex-col md:flex-row gap-y-4 justify-between items-center">
                          <div className="w-32 h-6 bg-zinc-200 rounded-md" />
                          <div className="w-32 h-6 bg-protectdata-500/20 rounded-md" />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        ) : (
          kanban && (
            <DndProviderWrapper>
              <KanbanBoard
                data={kanban}
                onUpdate={getTasksList}
                handleReorder={handleReorder}
              />
            </DndProviderWrapper>
          )
        )}
      </DashboardLayout>
    </>
  );
}
