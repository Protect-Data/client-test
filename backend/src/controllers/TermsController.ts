import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { randomUUID } from "crypto";

export const viewTerm = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const privacy = await prisma.useTerms.findUnique({
      where: {
        id
      }
    });
    // list versions
    const versions = await prisma.useTerms.findMany({
      where: {
        NOT: {
          signHash: null,
          id: id
        }
      },
      orderBy: { version: "desc" }
    });
    // return
    return res.status(200).json({ ...privacy, versions });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const viewTerms = async (req: any, res: Response) => {
  try {
    const policies = await prisma.useTerms.findMany({
      orderBy: { version: "desc" }
    });
    return res.status(200).json(policies);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const viewTermById = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const privacy = await prisma.useTerms.findUnique({
      where: { id }
    });
    return res.status(200).json({ ...privacy });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const createTerm = async (req: any, res: Response) => {
  try {
    const { id: userId } = req.user;
    const { author, version, content } = req.body;

    // Obtenha a política de privacidade mais recente
    const lastPolicy = await prisma.useTerms.findFirst({
      where: {
        NOT: {
          signHash: null
        }
      },
      orderBy: { version: "desc" }
    });

    if (lastPolicy) {
      const [lastMajor, lastMinor, lastPatch] = lastPolicy.version
        .split(".")
        .map(Number);
      const [newMajor, newMinor, newPatch] = version.split(".").map(Number);
      if (
        newMajor < lastMajor ||
        (newMajor === lastMajor && newMinor < lastMinor) ||
        (newMajor === lastMajor &&
          newMinor === lastMinor &&
          newPatch <= lastPatch)
      ) {
        return res.status(400).json({
          message:
            "A nova versão deve ser maior que a última versão registrada."
        });
      }
    }

    const create = await prisma.useTerms.create({
      data: {
        userId,
        author,
        version,
        content
      },
      select: {
        id: true,
        version: true
      }
    });
    return res.status(200).json({ ...create, success: true });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const updateTerm = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { author, version, content } = req.body;
    const update = await prisma.useTerms.update({
      where: {
        id
      },
      data: {
        author,
        version,
        content
      },
      select: {
        id: true,
        version: true
      }
    });
    return res.status(200).json({ ...update });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const deleteTerm = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.useTerms.delete({
      where: {
        id
      }
    });
    return res.status(200).json({});
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const publishTerm = async (req: any, res: Response) => {
  try {
    const { id: userId } = req.user;
    const { id } = req.params;
    // verify adm
    const isAdm = await prisma.user.findUnique({
      where: {
        id: userId,
        manager: true
      }
    });
    if (!isAdm) {
      return res.status(400).json({
        message:
          "Somente um administrador pode publicar uma nova versão de política de privacidade."
      });
    }
    // assinatura digital
    // update sign hash
    const update = await prisma.useTerms.update({
      where: {
        id
      },
      data: {
        signHash: randomUUID()
      },
      select: {
        id: true,
        version: true
      }
    });
    return res.status(200).json({ ...update });
  } catch (error) {
    return res.status(400).json(error);
  }
};
