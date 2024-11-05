import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { createLog } from "../services/logs.service";

export const getAllTask = async (req: any, res: Response) => {
  try {
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
    // where condition
    const _where =
      checkManager && checkManager.manager
        ? {
            trash: false
          }
        : {
            trash: false,
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
          };
    // find tasks
    const tasks = await prisma.task.findMany({
      where: _where,
      select: {
        id: true,
        title: true,
        status: true,
        privacy: true,
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            manager: true
          }
        },
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
            commentscl: {
              select: {
                id: true,
                created_at: true,
                comment: true,
                user: {
                  select: { id: true, name: true, manager: true }
                }
              }
            },
            members: {
              select: {
                name: true,
                manager: true
              }
            },
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
                id: true,
                manager: true
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
        logs: {
          include: {
            user: {
              select: {
                name: true,
                id: true
              }
            }
          }
        }
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
        id,
        trash: false
      },
      select: {
        id: true,
        title: true,
        status: true,
        privacy: true,
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            manager: true
          }
        },
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
            commentscl: {
              select: {
                id: true,
                created_at: true,
                comment: true,
                user: {
                  select: { id: true, name: true, manager: true }
                }
              }
            },
            members: {
              select: {
                name: true,
                manager: true
              }
            },
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
                id: true,
                manager: true
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
        logs: {
          include: {
            user: {
              select: {
                name: true,
                id: true
              }
            }
          }
        }
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

export const getTeam = async (req: any, res: Response) => {
  try {
    const { id: userId } = req.user;
    const findTeam = await prisma.user.findMany({
      where: {
        NOT: {
          id: userId
        }
      },
      select: {
        id: true,
        name: true,
        manager: true
      }
    });
    return res.status(200).json(findTeam);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const createTask = async (req: any, res: Response) => {
  try {
    const { id: userId } = req.user;
    const { title, description, status, privacy, members } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        privacy,
        user: { connect: { id: userId } },
        members: {
          connect: members.map((memberId: string) => ({ id: memberId }))
        }
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

export const updateTask = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;
    const { title, description, members } = req.body;

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
        title,
        description,
        members:
          members.length >= 1
            ? {
                connect: members.map((memberId: string) => ({ id: memberId }))
              }
            : { set: [] }
      },
      select: {
        id: true,
        title: true
      }
    });

    if (task.id) {
      await createLog(
        `Os detalhes da tarefa foram atualizados`,
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
        `O status foi atualizado para: ${status === 0
          ? `A Fazer`
          : status === 1 ? `Em Progresso` : `Finalizado`}`,
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

export const deleteTask = async (req: any, res: Response) => {
  try {
    const { id: userId } = req.user;
    const { id } = req.params;

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
        trash: true
      }
    });

    if (task) {
      await createLog(`A tarefa foi excluída`, userId, id);
    }

    return res.status(201).json(task);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
};
