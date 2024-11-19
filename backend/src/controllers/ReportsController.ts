import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import dayjs from "dayjs";
import "dayjs/locale/pt";
dayjs.locale("pt");

export const getReports = async (req: Request, res: Response) => {
  try {
    const payloadStructure: any = {
      tasks: {
        db: null,
        labels: [],
        data: []
      },
      tasksFinished: {
        db: null,
        labels: [],
        data: []
      },
      counter: {
        tasks: 0,
        tasksFinished: 0,
        tasksPercent: 0,
        users: 0,
        admins: 0,
        diagnostics: 0,
        diagnosticsAnswered: 0,
        documents: 0,
        policies: 0,
        policiesActive: 0,
        score: 0
      }
    };

    // média de conformidade
    // calcular a media do score de todas as últimas respostas
    const latestScores = await prisma.diagnostic.findMany({
      where: {
        client_answers: {
          some: {}
        }
      },
      select: {
        id: true,
        client_answers: {
          orderBy: {
            created_at: 'desc'
          },
          take: 1,
          select: {
            score: true,
          }
        }
      }
    });
    const averageScore = latestScores.reduce((acc:any, diag: any) => acc + diag.client_answers[0]?.score, 0) / latestScores.length;
    payloadStructure.counter.score = averageScore.toFixed();

    // tasks
    const startOfYear = dayjs().startOf("year").toISOString(); // Início do ano corrente
    const endOfYear = dayjs().endOf("year").toISOString(); // Fim do ano corrente
    const allMonths = Array.from({ length: 12 }, (_, index) =>
      dayjs().month(index).format("YYYY-MM")
    );

    const tasks = await prisma.task.findMany({
      where: {
        created_at: {
          gte: startOfYear, // Começo do ano corrente
          lte: endOfYear // Final do ano corrente
        }
      },
      select: {
        created_at: true // Vamos usar apenas a data de criação
      }
    });

    if (tasks) {
      const taskCountByMonth = tasks.reduce((acc: any, task) => {
        const month = dayjs(task.created_at).format("YYYY-MM");
        if (acc[month]) {
          acc[month] += 1;
        } else {
          acc[month] = 1;
        }
        return acc;
      }, {});
      const result = allMonths.map(month => ({
        date: month,
        count: taskCountByMonth[month] || 0
      }));
      payloadStructure.tasks.db = result;
      payloadStructure.tasks.labels = result.map((x: any) => x.date);
      payloadStructure.tasks.data = result.map((x: any) => x.count);
    }

    const tasksF = await prisma.task.findMany({
      where: {
        status: 2,
        created_at: {
          gte: startOfYear, // Começo do ano corrente
          lte: endOfYear // Final do ano corrente
        }
      },
      select: {
        created_at: true // Vamos usar apenas a data de criação
      }
    });

    if (tasksF) {
      const taskCountByMonth = tasksF.reduce((acc: any, task) => {
        const month = dayjs(task.created_at).format("YYYY-MM");
        if (acc[month]) {
          acc[month] += 1;
        } else {
          acc[month] = 1;
        }
        return acc;
      }, {});
      const result = allMonths.map(month => ({
        date: month,
        count: taskCountByMonth[month] || 0
      }));
      payloadStructure.tasksFinished.db = result;
      payloadStructure.tasksFinished.labels = result.map((x: any) => x.date);
      payloadStructure.tasksFinished.data = result.map((x: any) => x.count);
    }

    // counter
    const countTasks = await prisma.task.count();
    payloadStructure.counter.tasks = countTasks;
    const countTasksFinished = await prisma.task.count({
      where: {
        status: 2
      }
    });
    payloadStructure.counter.tasksFinished = countTasksFinished;
    payloadStructure.counter.tasksPercent = (countTasksFinished /
      countTasks *
      100).toFixed(1);
    const countUsers = await prisma.user.count();
    payloadStructure.counter.users = countUsers;
    const countAdmins = await prisma.user.count({
      where: {
        manager: true
      }
    });
    payloadStructure.counter.admins = (countAdmins / countUsers * 100).toFixed(
      1
    );
    const countDiags = await prisma.diagnostic.count();
    payloadStructure.counter.diagnostics = countDiags;
    const countDiagsAnswer = await prisma.diagnostic.count({
      where: {
        client_answers: {
          some: {}
        }
      }
    });
    payloadStructure.counter.diagnosticsAnswered = (countDiagsAnswer /
      countDiags *
      100).toFixed(1);
    const countDocuments = await prisma.file.count();
    payloadStructure.counter.documents = countDocuments;
    const countPolicies = await prisma.privacyPolicy.count();
    const countPoliciesActive = await prisma.privacyPolicy.count({
      where: {
        NOT: {
          signHash: null
        }
      }
    });
    payloadStructure.counter.policies = countPolicies;
    payloadStructure.counter.policiesActive = countPoliciesActive;

    return res.status(200).json(payloadStructure);
  } catch (error) {
    console.log("getReports", error);
    return res.status(400).json(error);
  }
};

function formatDate(date: any) {
  return date.toISOString().split("T")[0]; // Retorna apenas a data no formato YYYY-MM-DD
}
