import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { createLog } from "../services/logs.service";

export const createItem = async (req: any, res: Response) => {
  try {
    const { id: userId } = req.user;
    const { taskId } = req.params;
    const { title, members } = req.body;

    const _comment = await prisma.checkList.create({
      data: {
        title,
        task: { connect: { id: taskId } },
        user: { connect: { id: userId } },
        members: {
          connect: members.map((memberId: string) => ({ id: memberId }))
        }
      },
      select: {
        id: true,
        title: true,
        members: true
      }
    });

    if (_comment.id) {
      await createLog("Item adicionado ao checklist", userId, taskId);
    }

    return res.status(201).json(_comment);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Falha ao adicionar comentário" });
  }
};

export const finalizeChecklist = async (req: any, res: Response) => {
  try {
    const { id: userId } = req.user;
    const { id } = req.params;
    const findTask = await prisma.checkList.findUnique({
      where: {
        id
        //userId: userId
      },
      select: {
        taskId: true,
        status: true
      }
    });
    if (!findTask) {
      return res.status(400).json({ message: "Checklist não encontrada" });
    }
    const ACTUAL_STATUS = findTask.status;
    if (ACTUAL_STATUS === 0) {
      await prisma.checkList.update({
        where: {
          id
        },
        data: {
          status: 1
        }
      });
      await createLog(
        "Checklist marcado como finalizado",
        userId,
        findTask.taskId
      );
    } else {
      await prisma.checkList.update({
        where: {
          id
        },
        data: {
          status: 0
        }
      });
      await createLog(
        "Checklist desmarcado como finalizado",
        userId,
        findTask.taskId
      );
    }

    return res.status(201).json({});
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
};

export const deleteChecklist = async (req: any, res: Response) => {
  try {
    const { id: userId } = req.user;
    const { id } = req.params;
    const findTask = await prisma.checkList.findUnique({
      where: {
        id,
        userId: userId
      }
    });
    if (!findTask) {
      return res.status(400).json({ message: "Checklist não encontrada" });
    }
    const task = await prisma.checkList.delete({
      where: {
        id,
        userId: userId
      }
    });
    return res.status(201).json(task);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
};

export const commentChecklist = async (req: any, res: Response) => {
  try {
    const { id: userId } = req.user;
    const { id } = req.params;
    const { comment } = req.body;
    const findTask = await prisma.checkList.findUnique({
      where: {
        id
      },
      select: {
        title: true,
        taskId: true,
        status: true
      }
    });
    if (!findTask) {
      return res.status(400).json({ message: "Checklist não encontrada" });
    }

    await prisma.commentCL.create({
      data: {
        comment,
        checklist: { connect: { id: id } },
        user: { connect: { id: userId } }
      }
    });
    await createLog(
      `Comentário enviado no checklist: ${findTask.title}`,
      userId,
      findTask.taskId
    );

    return res.status(201).json({});
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
};

export const deleteCommentChecklist = async (req: any, res: Response) => {
  try {
    const { id: userId } = req.user;
    const { id } = req.params;

    await prisma.commentCL.delete({
      where: {
        id
      }
    });

    return res.status(201).json({});
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
};
