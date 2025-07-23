import { Router } from 'express';
import {
  createReservation,
  getReservations,
  getReservationById,
  deleteReservation,
} from '../controllers/reservation';

const reservationRoute = Router();

reservationRoute.post('/reservations/', createReservation);
reservationRoute.get('/reservations/', getReservations);
reservationRoute.get('/reservations/:id', getReservationById);
reservationRoute.delete('/reservations/:id', deleteReservation);

export default reservationRoute;
