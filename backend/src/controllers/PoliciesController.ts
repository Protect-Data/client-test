import { Request, Response } from "express";
import { prisma } from "../database/prisma";

export const viewPolicie = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const privacy = await prisma.privacyPolicy.findUnique({
      where: {
        id,
        NOT: {
          signHash: null
        }
      }
    });
    return res.status(200).json({ ...privacy });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const viewPolicies = async (req: any, res: Response) => {
  try {
    const policies = await prisma.privacyPolicy.findMany({});
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
    return res.status(200).json({ ...create });
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
