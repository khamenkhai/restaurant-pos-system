// import { PrismaClient } from "@prisma/client";
// import { NextFunction, Request, Response } from "express";
// // import { UnauthorizedException } from "../exceptions/unauthorized-exceptions";
// // import { ErrorCodes } from "../exceptions/root";
// import jwt from "jsonwebtoken";

// export const JWT_SECRET = process.env.JWT_SECRET || "SECRET";

// // Extend Express Request to include `user`
// declare global {
//   namespace Express {
//     interface Request {
//       user?: any; // ideally, type this to your actual User model from Prisma
//     }
//   }
// }

// const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return next(new UnauthorizedException("Unauthorized", ErrorCodes.UNAUTHORIZED));
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const payload = jwt.verify(token, JWT_SECRET) as { userId: number };

//     const user = await PrismaClient.user.findUnique({
//       where: { id: payload.userId },
//     });

//     if (!user) {
//       return next(new UnauthorizedException("Unauthorized", ErrorCodes.UNAUTHORIZED));
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     return next(new UnauthorizedException("Unauthorized", ErrorCodes.UNAUTHORIZED));
//   }
// };

// export default authMiddleware;