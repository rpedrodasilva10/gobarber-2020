import { getRepository } from 'typeorm';
import User from '../models/User';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';
import AppError from '../errors/AppError';
interface SessionRequest {
  email: string;
  password: string;
}

interface SessionResponse {
  user: User;
  token: string;
}

class CreateUserSessionService {
  async execute({ email, password }: SessionRequest): Promise<SessionResponse> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({
      where: { email: email },
    });

    if (!user) {
      throw new AppError('Invalid credentials! Check your email and password!', 401);
    }

    const correctPassword = await compare(password, user.password);

    if (!correctPassword) {
      throw new AppError('Invalid credentials! Check your email and password!', 401);
    }

    delete user.password;

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return { user, token };
  }
}

export default CreateUserSessionService;
