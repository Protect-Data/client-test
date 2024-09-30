import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "PR0TECT_D4T4_JWT";

export default function verifyToken(
  req: any,
  res: Response,
  next: NextFunction
) {
  const token = req.headers["authorization"];
  const formatToken = token ? token.split(" ")[1] : ``;
  if (!formatToken || formatToken === "") {
    return res.status(401).json({ message: "Token is missing" });
  }

  jwt.verify(formatToken.trim(), JWT_SECRET, (err: any, decoded: any) => {
    if (err) console.log("[verifyTokenError]", err);
    if (err) return res.sendStatus(401);
    req.user = { ...req.user, id: decoded.id, email: decoded.email };
    next();
  });
}
