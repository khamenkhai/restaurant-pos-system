import { Request, Response, NextFunction } from 'express';
import { prismaClient } from '../utils/prismaClient';
import { sendResponse } from '../utils/response';

export const createReservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, phone, date, people, table_id } = req.body;

        const reservation = await prismaClient.reservation.create({
            data: {
                name,
                phone,
                date: new Date(date),
                people,
                table_id,
            },
        });

        sendResponse(res, 201, 'Reservation created successfully', reservation)

    } catch (error) {
        console.error('[createReservation]', error);
        next(error);
    }
};

export const getReservations = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const reservations = await prismaClient.reservation.findMany({
            include: { table: true },
        });
        sendResponse(res, 200, 'Reservation fetch successfully', reservations)

    } catch (error) {
        console.error('[getReservations]', error);
        next(error);
    }
};

export const getReservationById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const id = Number(req.params.id);

        const reservation = await prismaClient.reservation.findUnique({
            where: { id },
            include: { table: true },
        });

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        sendResponse(res, 200, 'Reservation fetch successfully', reservation);

    } catch (error) {
        console.error('[getReservationById]', error);
        next(error);
    }
};

export const deleteReservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);

        await prismaClient.reservation.delete({
            where: { id },
        });

        sendResponse(res, 200, 'Reservation deleted successfully', null);

    } catch (error) {
        console.error('[deleteReservation]', error);
        next(error);
    }
};
