import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET_TWOFACTOR =
  process.env.JWT_SECRET_TWOFACTOR || "PR0TECT_D4T4_JWT_TW0FACT0R";

export function verifyToken(req: any, res: Response, next: NextFunction) {
  const token = req.headers["authorization"];
  const formatToken = token ? token.split(" ")[1] : ``;
  if (!formatToken || formatToken === "") {
    return res.status(401).json({ message: "Token is missing" });
  }
  jwt.verify(formatToken, JWT_SECRET_TWOFACTOR, (err: any, decoded: any) => {
    if (err) {
      console.log("[verifyTokenError]", err);
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = {
      ...req.user,
      id: decoded.id,
      email: decoded.email,
      "2fa": false
    };
    next();
  });
}
