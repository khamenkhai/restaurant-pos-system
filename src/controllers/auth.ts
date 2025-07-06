import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../utils/prismaClient";
import { AppError } from "../utils/app-error";
import { hashSync, compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "SECRET"

export const register = async (req: Request, res: Response, next: NextFunction) => {

    const { name, email, password } = req.body;

    let user = await prismaClient.user.findFirst({ where: { email: email } });

    if (user) {
        throw new AppError("User already existed!", 500);
    }

    const hasedPassword = hashSync(password, 10);

    user = await prismaClient.user.create({
        data: {
            name: name,
            email: email,
            password: hasedPassword
        }
    });

    res.status(201).json({
        statusCode: 201,
        message: "User",
        data: user
    });
}


export const login = async (req: Request, res: Response, next: NextFunction) => {

    const { email, password } = req.body;

    let user = await prismaClient.user.findFirst({ where: { email } });

    if (!user) {
        throw new AppError("User does not existed!", 409);
    }

    if (!compareSync(password, user.password)) {
        throw new AppError("Incorrect password!", 409);
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });

    res.json({
        message: "Login successful",
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            access_token: token
        },
    });
}

