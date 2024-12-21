import { Request, Response } from "express";

export const clientCfg = async (req: any, res: Response) => {
  try {
    let payload = {
      name:
        process.env.CFG_CLIENT && process.env.CFG_CLIENT !== ""
          ? process.env.CFG_CLIENT
          : null,
      logo:
        process.env.CFG_LOGO && process.env.CFG_LOGO !== ""
          ? process.env.CFG_LOGO
          : null
    };
    return res.status(201).json(payload);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Falha ao adicionar comentário" });
  }
};
