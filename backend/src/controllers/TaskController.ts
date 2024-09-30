import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { createLog } from "../services/logs.service";

export const getAllTask = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      select: {
        id: true,
        title: true,
        status: true,
        privacy: true,
        user: {
          select: {
            name: true
          }
        },
        description: true,
        created_at: true,
        updated_at: true,
        end_at: true,
        checklist: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        },
        comments: {
          include: {
            user: {
              select: {
                name: true,
                id: true
              }
            }
          }
        },
        files: {
          include: {
            user: {
              select: {
                name: true,
                id: true
              }
            }
          }
        },
        logs: true
      }
    });

    if (!tasks) {
      return res.status(204);
    }
    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const findTask = await prisma.task.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        title: true,
        status: true,
        privacy: true,
        user: {
          select: {
            name: true
          }
        },
        description: true,
        created_at: true,
        updated_at: true,
        end_at: true,
        checklist: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        },
        comments: {
          include: {
            user: {
              select: {
                name: true,
                id: true
              }
            }
          }
        },
        files: {
          include: {
            user: {
              select: {
                name: true,
                id: true
              }
            }
          }
        },
        logs: true
      }
    });
    if (!findTask) {
      return res.status(400).json({ message: "Tarefa não encontrada" });
    }
    return res.status(200).json(findTask);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const createTask = async (req: any, res: Response) => {
  try {
    const { id: userId } = req.user;
    const { title, description, status, privacy } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        privacy,
        user: { connect: { id: userId } }
      },
      select: {
        id: true,
        title: true,
        status: true,
        privacy: true,
        description: true
      }
    });

    if (task.id) {
      await createLog("A tarefa foi criada", userId, task.id);
    }

    return res.status(201).json(task);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Falha ao adicionar tarefa" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const findTask = await prisma.task.findUnique({
      where: {
        id
      }
    });

    if (!findTask) {
      return res.status(400).json({ message: "Tarefa não encontrada" });
    }

    const task = await prisma.task.update({
      where: {
        id
      },
      data: {
        title
      },
      select: {
        id: true,
        title: true
      }
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
};

export const updateTaskStatus = async (req: any, res: Response) => {
  try {
    const { id: userId } = req.user;
    const { id } = req.params;
    const { status } = req.body;

    const findTask = await prisma.task.findUnique({
      where: {
        id
      }
    });

    if (!findTask) {
      return res.status(400).json({ message: "Tarefa não encontrada" });
    }

    const task = await prisma.task.update({
      where: {
        id
      },
      data: {
        status
      },
      select: {
        id: true,
        title: true
      }
    });

    if (task.id) {
      await createLog(
        `O status foi atualizado para: ${status}`,
        userId,
        task.id
      );
    }

    return res.status(201).json(task);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const findTask = await prisma.task.findUnique({
      where: {
        id
      }
    });

    if (!findTask) {
      return res.status(400).json({ message: "Tarefa não encontrada" });
    }

    const task = await prisma.task.delete({
      where: {
        id
      }
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
};
