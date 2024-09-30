import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "PR0TECT_D4T4_JWT";

export const Login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Verifique se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // Verifique se a senha está correta
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // Gere o token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name
      },
      JWT_SECRET,
      { expiresIn: "48h" }
    );
    // await createLog("Iniciou uma sessão", user.id, null);
    // Retorne o token e as informações do usuário
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        manager: user.manager
      }
    });
  } catch (error) {
    console.error("failed to login", error);
    return res.status(400).json(error);
  }
};

export const ForgotPass = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // FORGOT PASSWORD

    return res.status(200).json({});
  } catch (error) {
    console.error("failed to login", error);
    return res.status(400).json(error);
  }
};
