import { User } from "../../generated/prisma";
// import { express } from "express";

declare module 'express' {
    export interface Request {
        user?: any
    }
}