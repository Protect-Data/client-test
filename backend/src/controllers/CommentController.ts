import { prisma } from "../database/prisma";
import { createLog } from "../services/logs.service";
import { Request, Response } from "express";

export const createComment = async (req: any, res: Response) => {
  try {
    const { id: userId } = req.user;
    const { taskId } = req.params;
    const { comment, replyId } = req.body;

    // upload file if has
    // payload to create
    const payload: any =
      replyId && replyId !== ""
        ? {
            data: {
              comment,
              task: { connect: { id: taskId } },
              user: { connect: { id: userId } },
              parent: {
                connect: {
                  id: replyId
                }
              }
            },
            select: {
              id: true,
              comment: true,
              replyId: true,
              replies: true
            }
          }
        : {
            data: {
              comment,
              task: { connect: { id: taskId } },
              user: { connect: { id: userId } }
            },
            select: {
              id: true,
              comment: true,
              replyId: true,
              replies: true
            }
          };
    const _comment = await prisma.comment.create(payload);

    if (_comment.id) {
      await createLog("Comentário enviado", userId, taskId);
    }

    return res.status(201).json(_comment);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Falha ao adicionar comentário" });
  }
};

export const deleteComment = async (req: any, res: Response) => {
  try {
    const { id: userId } = req.user;
    const { commentId } = req.params;

    const findTask = await prisma.comment.findUnique({
      where: {
        id: commentId,
        userId
      }
    });

    if (!findTask) {
      return res.status(400).json({ message: "Comentário não encontrada" });
    }

    const task = await prisma.comment.delete({
      where: {
        id: commentId,
        userId
      }
    });

    if (task) {
      await createLog("Comentário excluído", findTask.userId, findTask.id);
    }

    return res.status(201).json(task);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
};
