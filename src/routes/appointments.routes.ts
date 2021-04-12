import { Router } from 'express';
import { startOfHour, parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();

/**
 * Create a new appointment
 */
appointmentsRouter.post('/', async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);
  const createAppointmentService = new CreateAppointmentService();
  const { date, provider } = request.body;

  const parsedDate = startOfHour(parseISO(date));

  if (await appointmentsRepository.isAlreadyBookedHour(parsedDate)) {
    return response
      .status(400)
      .json({ message: 'Date already busy!', data: date });
  }

  const newAppointment = await createAppointmentService.execute({
    date: parsedDate,
    provider,
  });

  return response
    .status(201)
    .json({ message: 'Successfully created', data: newAppointment });
});

/**
 * Get all appointments
 */
appointmentsRouter.get('/', async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);
  return response.json(await appointmentsRepository.find());
});

export default appointmentsRouter;
