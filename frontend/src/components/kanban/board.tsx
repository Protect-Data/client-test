"use client";

import { useState } from "react";
import Column from "./column";
import axios from "axios";

const KanbanBoard = ({
  data,
  onUpdate,
  handleReorder
}: {
  data: any;
  onUpdate: () => void;
  handleReorder: (e: any) => void;
}) => {
  const [cards, setCards] = useState([...data]);

  const moveCard = async (
    id: string,
    newStatus: number,
    targetIndex: number
  ) => {
    await updateTaskStatus(id, newStatus);
    console.log("targetIndex", targetIndex);
    setCards((prevKanban) => {
      const newKanban = [...prevKanban];
      let taskToMove = null;
      let currentColumnIndex = -1;
      // Encontre e remova o card da posição atual
      for (let i = 0; i < newKanban.length; i++) {
        const taskIndex = newKanban[i].list.findIndex(
          (task: any) => task.id === id
        );
        if (taskIndex !== -1) {
          taskToMove = newKanban[i].list[taskIndex];
          currentColumnIndex = i;
          newKanban[i].list.splice(taskIndex, 1);
          break;
        }
      }
      // Insere o card na nova posição
      if (taskToMove) {
        taskToMove.status = newStatus;
        if (currentColumnIndex === newStatus) {
          // Movendo dentro da mesma coluna, reposiciona no índice alvo
          newKanban[newStatus].list.splice(targetIndex, 0, taskToMove);
        } else {
          // Movendo para uma coluna diferente, insere no índice final
          newKanban[newStatus].list.push(taskToMove);
        }
      }
      return newKanban;
    });
    handleReorder(cards);
  };

  const updateTaskStatus = async (taskId: string, newStatus: number) => {
    try {
      const { data: update }: any = await axios.put(
        `/api/v1/tasks/status?taskId=${taskId}`,
        {
          status: newStatus
        }
      );
    } catch (error) {
      console.error("updateTaskStatusError", error);
    }
  };

  return (
    <>
      <div className="w-full min-h-[84vh] h-full grid grid-cols-1 xl:grid-cols-3 gap-x-4">
        {data &&
          data.map((x: any, k: number) => (
            <Column
              key={k}
              status={x.title}
              cards={x.list}
              moveCard={moveCard}
              onUpdate={onUpdate}
            />
          ))}
      </div>
    </>
  );
};

export default KanbanBoard;
