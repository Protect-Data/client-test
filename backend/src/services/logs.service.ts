import { prisma } from "../database/prisma";

export async function createLog(
  action: string,
  userId: string,
  taskId?: string | null
) {
  try {
    await prisma.log.create({
      data: {
        action,
        userId,
        taskId: taskId || ""
      }
    });
  } catch (error) {
    console.error("Erro ao criar log:", action, userId, taskId, error);
  }
}
