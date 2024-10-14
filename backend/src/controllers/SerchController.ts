import { Request, Response } from "express";
import { prisma } from "../database/prisma";

export const searchDb = async (req: any, res: Response) => {
  try {
    const { term } = req.body;
    const { id: userId } = req.user;
    // check manager
    const checkManager = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        manager: true
      }
    });
    // find results
    const tasks = await prisma.task.findMany({
      where:
        checkManager && checkManager.manager
          ? {
              title: {
                contains: term,
                mode: "insensitive"
              }
            }
          : {
              title: {
                contains: term,
                mode: "insensitive"
              },
              OR: [
                {
                  AND: [
                    { privacy: "public" },
                    {
                      members: {
                        none: {}
                      }
                    }
                  ]
                },
                {
                  AND: [
                    { privacy: "public" },
                    { members: { some: { id: userId } } }
                  ]
                },
                {
                  AND: [
                    { privacy: "private" },
                    { members: { some: { id: userId } } }
                  ]
                }
              ]
            },
      take: 10
    });
    tasks.map((x: any) => {
      x.category = "Tarefas";
      x.url = `/dashboard/tasks?taskId=${x.id}`;
      return x;
    });

    const documents = await prisma.file.findMany({
      where:
        checkManager && checkManager.manager
          ? {
              filename: {
                contains: term,
                mode: "insensitive"
              }
            }
          : {},
      take: 10
    });
    documents.map((x: any) => {
      x.title = x.filename;
      x.url = `/dashboard/tasks?taskId=${x.taskId}&tab=files`;
      x.category = "Documentos";
      return x;
    });

    return res.status(201).json([...tasks, ...documents]);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
};
