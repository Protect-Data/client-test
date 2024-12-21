import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import { forgotPassMail } from "../services/email.service";
import { authenticator } from "otplib";
import QRCode from "qrcode";

const JWT_SECRET = process.env.JWT_SECRET || "PR0TECT_D4T4_JWT";
const JWT_SECRET_TWOFACTOR =
  process.env.JWT_SECRET_TWOFACTOR || "PR0TECT_D4T4_JWT_TW0FACT0R";

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
      return res.status(401).json({ message: "Email não encontrado" });
    }

    const randomNum = Math.random() * 9000;
    const code = Math.floor(1000 + randomNum);

    // FORGOT PASSWORD
    const redefineCode = await prisma.redefinePass.create({
      data: {
        expires_at: dayjs().add(15, "minutes").toISOString(),
        email,
        code: code.toString()
      },
      select: {
        id: true,
        expires_at: true,
        email: true
      }
    });

    // SEND EMAIL
    await forgotPassMail({
      email,
      code: code.toString(),
      name: user.name
    });

    return res.status(200).json(redefineCode);
  } catch (error) {
    console.error("failed to login", error);
    return res.status(400).json(error);
  }
};

export const RedefinePass = async (req: Request, res: Response) => {
  const { password, email, code } = req.body;

  try {
    const checkCode = await prisma.redefinePass.findFirst({
      where: { code, email },
      select: { id: true, expires_at: true }
    });
    if (!checkCode) {
      return res
        .status(401)
        .json({ message: "Falha ao validar o código de redefinição" });
    }
    // validate expiration
    const today = dayjs().unix();
    const isExpired = today > dayjs(checkCode.expires_at).unix();

    if (isExpired) {
      return res
        .status(401)
        .json({ message: "O código expirou e não é mais válido" });
    }

    // validate user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true
      }
    });
    if (!user) {
      return res.status(401).json({ message: "Falha ao encontrar o usuário" });
    }

    const hashPassword = await hash(password, 8);

    // FORGOT PASSWORD
    await prisma.user.update({
      where: {
        id: user.id,
        email
      },
      data: {
        password: hashPassword
      }
    });
    await prisma.redefinePass.update({
      where: {
        id: checkCode.id
      },
      data: {
        redefined: true
      }
    });

    return res.status(200).json({});
  } catch (error) {
    console.error("failed to login", error);
    return res.status(400).json(error);
  }
};

export const ActiveTwoFactor = async (req: any, res: Response) => {
  try {
    const { id: userId } = req.user;
    const userData = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });
    if (!userData) {
      return res.status(400).json({ error: "Sessão inválida" });
    }
    if (userData.twoFactorSecret !== null) {
      return res.status(400).json({ error: "Segundo fator já está ativado" });
    }
    const secret = authenticator.generateSecret();
    const serviceName =
      process.env.CFG_CLIENT && process.env.CFG_CLIENT !== ""
        ? `${process.env.CFG_CLIENT} | ProtectData`
        : "ProtectData";
    const userIdentifier = userData.email;
    const otpauth = authenticator.keyuri(userIdentifier, serviceName, secret);
    const qrCodeImage = await QRCode.toDataURL(otpauth);
    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        twoFactorSecret: secret
      }
    });
    return res.status(200).json({ qrCodeImage });
  } catch (error) {
    console.error("failed to active two factor", error);
    return res.status(400).json(error);
  }
};

export const ValidateTwoFactor = async (req: any, res: Response) => {
  try {
    const { id: userId } = req.user;
    const { code } = req.body;
    const userData = await prisma.user.findUnique({
      where: {
        id: userId,
        twoFactorSecret: { not: "" }
      }
    });
    if (!userData) {
      return res.status(400).json({ error: "Dois fatores desativado" });
    }
    const isValid = authenticator.check(
      code,
      userData.twoFactorSecret as string
    );
    if (isValid) {
      const token = jwt.sign(
        {
          id: userData.id,
          email: userData.email,
          name: userData.name
        },
        JWT_SECRET_TWOFACTOR,
        { expiresIn: "1h" }
      );
      return res
        .status(200)
        .json({ message: "Token válido!", success: true, token });
    } else {
      return res.status(401).json({ message: "Token inválido!" });
    }
  } catch (error) {
    console.error("failed to validate", error);
    return res.status(400).json(error);
  }
};
