import { getRepository } from 'typeorm';
import User from '../models/User';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

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

    const token = sign({}, 'bbaa0487-5316-4da1-9be5-b42fbe47abb2', {
      subject: user.id,
      expiresIn: '1d',
    });

    return { user, token };
  }
}

export default CreateUserSessionService;
