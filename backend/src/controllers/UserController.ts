import { hash } from "bcryptjs";
import { Request, Response } from "express";

import { prisma } from "../database/prisma";

export const me = async (req: any, res: Response) => {
  try {
    const { id: userId, "2fa": is_2fa } = req.user;
    const user: any = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        name: true,
        email: true,
        manager: true,
        twoFactorSecret: true
      }
    });
    if (!user) {
      return res.status(400).json({ error: "Sessão inválida" });
    }
    // console.log("user", user);
    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      manager: user.manager,
      two_factor: {
        active: !!user.twoFactorSecret,
        authenticated: is_2fa
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, manager } = req.body;

    const isUserUniqueEmail = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (isUserUniqueEmail) {
      return res
        .status(400)
        .json({ message: "Já existe um usuário com este email" });
    }

    const hashPassword = await hash(password, 8);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
        manager
      },
      select: {
        id: true,
        name: true,
        email: true,
        manager: true
      }
    });

    return res.status(201).json(user);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
};

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        manager: true,
        twoFactorSecret: true
      }
    });
    if (!users) {
      return res.status(204);
    }
    const updatedUsers = users.map((user: any) => ({
      ...user,
      twoFactorSecret: !!user.twoFactorSecret
    }));
    return res.status(200).json(updatedUsers);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password, manager } = req.body;

    const findUser = await prisma.user.findUnique({
      where: {
        id
      }
    });

    if (!findUser) {
      return res.status(400).json({ message: "Usuário não encontrado" });
    }

    const user = await prisma.user.update({
      where: {
        id
      },
      data: {
        name
      },
      select: {
        id: true,
        name: true
      }
    });

    return res.status(201).json(user);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const findUser = await prisma.user.findUnique({
      where: {
        id
      }
    });

    if (!findUser) {
      return res.status(400).json({ message: "Usuário não encontrado" });
    }

    const user = await prisma.user.delete({
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
