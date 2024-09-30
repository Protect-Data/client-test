import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import dayjs from "dayjs";
import "dayjs/locale/pt";
dayjs.locale("pt");

export const getReports = async (req: Request, res: Response) => {
  try {
    const payloadStructure: any = {
      tasks: {
        title: "Relatório de Tarefas",
        db: null,
        labels: [],
        data: []
      },
      byUsers: {
        title: "Relatório de Usuários",
        db: null,
        labels: [],
        data: []
      },
      comparative: {
        title: "Comparativo com o Mês Anterior",
        db: null,
        labels: [],
        data: []
      }
    };

    // tasks
    const tasks = await prisma.task.groupBy({
      by: ["created_at"],
      _count: {
        id: true
      },
      orderBy: {
        created_at: "asc"
      },
      where: {
        // status: 2,
        created_at: {
          lte: dayjs().toISOString(),
          gte: dayjs().startOf("month").toISOString()
        }
      }
    });
    if (tasks) {
      const taskCountByDay = tasks.reduce((acc: any, task) => {
        const day = formatDate(task.created_at);
        if (!acc[day]) {
          acc[day] = 1;
        } else {
          acc[day]++;
        }
        return acc;
      }, {});
      const result = Object.entries(taskCountByDay).map(([date, count]) => ({
        date,
        count
      }));
      payloadStructure.tasks.db = result;
      payloadStructure.tasks.labels = result.map((x: any) => x.date);
      payloadStructure.tasks.data = result.map((x: any) => x.count);
    }
    // users
    const users = await prisma.task.findMany({
      select: {
        userId: true,
        status: true,
        user: {
          select: {
            name: true
          }
        }
      },
      where: {
        created_at: {
          lte: dayjs().toISOString(),
          gte: dayjs().startOf("month").toISOString()
        }
      }
    });
    if (users) {
      const taskCountByUser = users.reduce((acc: any, task: any) => {
        const { userId, user: { name } } = task;
        if (!acc[userId]) {
          acc[userId] = {
            userName: name,
            toDo: 0,
            inProgress: 0,
            done: 0
          };
        }
        if (task.status === 0) {
          acc[userId].toDo++;
        } else if (task.status === 1) {
          acc[userId].inProgress++;
        } else if (task.status === 2) {
          acc[userId].done++;
        }

        return acc;
      }, {});
      // Transformando o resultado em um array
      const result = Object.entries(
        taskCountByUser
      ).map(([userId, counts]: any) => ({
        user: counts.userName,
        toDo: counts.toDo,
        inProgress: counts.inProgress,
        done: counts.done
      }));
      payloadStructure.byUsers.db = result;
      payloadStructure.byUsers.labels = result.map((x: any) => x.user);
      payloadStructure.byUsers.data = {
        toDo: result.map((x: any) => x.toDo),
        inProgress: result.map((x: any) => x.inProgress),
        done: result.map((x: any) => x.done)
      };
    }
    // comparative

    return res.status(200).json(payloadStructure);
  } catch (error) {
    return res.status(400).json(error);
  }
};

function formatDate(date: any) {
  return date.toISOString().split("T")[0]; // Retorna apenas a data no formato YYYY-MM-DD
}
