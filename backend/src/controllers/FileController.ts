import { prisma } from "../database/prisma";
import { createLog } from "../services/logs.service";
import { Request, Response } from "express";
import { handlerDelete, handlerUpload } from "../services/upload.service";

export const uploadFile = async (req: any, res: Response) => {
  try {
    const { id: userId } = req.user;
    const { taskId } = req.params;
    const { base64, filename, mimetype } = req.body;

    // upload file
    const uploadFile = await handlerUpload(base64, filename, mimetype);
    // save on db
    const upload = await prisma.file.create({
      data: {
        uri: uploadFile.fileUrl,
        filename,
        mimetype,
        task: { connect: { id: taskId } },
        user: {
          connect: {
            id: userId
          }
        }
      },
      select: {
        id: true,
        uri: true,
        filename: true,
        mimetype: true
      }
    });

    if (upload.id) {
      await createLog(`Anexo enviado: ${filename}`, userId, taskId);
    }

    return res.status(201).json(upload);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Falha ao adicionar comentário" });
  }
};

export const deleteFile = async (req: any, res: Response) => {
  try {
    const { id: userId } = req.user;
    const { fileId } = req.params;

    // find file
    const file = await prisma.file.findUnique({
      where: {
        id: fileId,
        userId
      },
      select: {
        taskId: true,
        filename: true,
        uri: true
      }
    });

    if (!file) {
      return res.status(400).json({ message: "Arquivo não encontrado" });
    }

    const formatFile = file.uri.split("/");
    console.log("file", file, formatFile);

    // delete file
    await handlerDelete(formatFile[3]);

    // delete on db
    const _delete = await prisma.file.delete({
      where: {
        id: fileId,
        userId
      }
    });

    if (_delete) {
      await createLog(`Anexo excluido: ${file.filename}`, userId, file.taskId);
    }

    return res.status(201).json(_delete);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Falha ao excluir anexo" });
  }
};
