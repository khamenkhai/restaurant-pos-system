import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prismaClient } from "../utils/prismaClient";
import { AppError } from "../utils/app-error";

// Define your JWT payload interface
interface JwtPayload {
  userId: number;
  // Add other potential payload fields here
}

// Define your User type based on Prisma model (adjust according to your actual schema)
type User = {
  id: number;
  email: string;
  // Add other user properties from your schema
};

// Extend Express Request with properly typed user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Get token and check if it exists
  let token: string;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  } else {
    return next(new AppError("You are not logged in! Please log in to get access.", 401));
  }

  // 2. Verify token
  let decoded: JwtPayload;
  
  try {
    decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    // Handle different JWT errors specifically
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError("Your token has expired! Please log in again.", 401));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError("Invalid token! Please log in again.", 401));
    }
    return next(new AppError("Authentication failed", 401));
  }

  // 3. Check if user still exists
  const currentUser = await prismaClient.user.findUnique({
    where: { id: decoded.userId },
  });

  if (!currentUser) {
    return next(new AppError("The user belonging to this token no longer exists.", 401));
  }

  // 4. Check if user changed password after the token was issued
  // (You would need to add a passwordChangedAt field to your User model)
  // if (currentUser.passwordChangedAt) {
  //   const changedTimestamp = currentUser.passwordChangedAt.getTime() / 1000;
  //   if (decoded.iat && changedTimestamp > decoded.iat) {
  //     return next(new AppError("User recently changed password! Please log in again.", 401));
  //   }
  // }

  // 5. Grant access to protected route
  req.user = currentUser;
  next();
};

export default authMiddleware;