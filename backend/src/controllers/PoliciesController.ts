import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { randomUUID } from "crypto";

export const viewPolicie = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const privacy = await prisma.privacyPolicy.findUnique({
      where: {
        id
      }
    });
    // list versions
    const versions = await prisma.privacyPolicy.findMany({
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

export const viewPolicies = async (req: any, res: Response) => {
  try {
    const policies = await prisma.privacyPolicy.findMany({
      orderBy: { version: "desc" }
    });
    return res.status(200).json(policies);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const viewPolicieById = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const privacy = await prisma.privacyPolicy.findUnique({
      where: { id }
    });
    return res.status(200).json({ ...privacy });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const createPolicie = async (req: any, res: Response) => {
  try {
    const { id: userId } = req.user;
    const { author, version, content } = req.body;

    // Obtenha a política de privacidade mais recente
    const lastPolicy = await prisma.privacyPolicy.findFirst({
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

    const create = await prisma.privacyPolicy.create({
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

export const updatePolicie = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { author, version, content } = req.body;
    const update = await prisma.privacyPolicy.update({
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

export const deletePolicie = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.privacyPolicy.delete({
      where: {
        id
      }
    });
    return res.status(200).json({});
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const publishPolicie = async (req: any, res: Response) => {
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
    const update = await prisma.privacyPolicy.update({
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
