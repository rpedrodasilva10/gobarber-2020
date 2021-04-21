import { getRepository } from 'typeorm';
import User from '../models/User';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';
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
      throw new Error('Invalid credentials! Check your email and password!');
    }

    const correctPassword = await compare(password, user.password);

    if (!correctPassword) {
      throw new Error('Invalid credentials! Check your email and password!');
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
