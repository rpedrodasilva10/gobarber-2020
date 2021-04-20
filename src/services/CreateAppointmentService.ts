import { getCustomRepository } from 'typeorm';
import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface AppointmentRequest {
  date: Date;
  provider_id: string;
}
class CreateAppointmentService {
  public async execute({
    date,
    provider_id,
  }: AppointmentRequest): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointment = appointmentsRepository.create({
      date,
      provider_id,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
