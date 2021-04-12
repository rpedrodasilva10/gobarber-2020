import { EntityRepository, Repository } from 'typeorm';
import Appointment from '../models/Appointment';

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment> {
  public async isAlreadyBookedHour(parsedDate: Date): Promise<boolean> {
    const alreadyBusyOnDate = await this.findOne({
      where: {
        date: parsedDate,
      },
    });

    return alreadyBusyOnDate ? true : false;
  }
}

export default AppointmentsRepository;
