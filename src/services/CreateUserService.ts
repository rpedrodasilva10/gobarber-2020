import { getRepository } from 'typeorm';
import User from '../models/User';
import { hash } from 'bcryptjs';

interface UserRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  async execute({ name, email, password }: UserRequest): Promise<User> {
    const userRepository = getRepository(User);

    const isDuplicatedUser = await userRepository.findOne({
      where: { email: email },
    });

    if (isDuplicatedUser) {
      throw new Error('Email already used');
    }
    const encryptedPassword = await hash(password, 8);
    const newUser = userRepository.create({
      name,
      email,
      password: encryptedPassword,
    });

    await userRepository.save(newUser);


    delete newUser.password;
    return newUser;
  }
}

export default CreateUserService;
