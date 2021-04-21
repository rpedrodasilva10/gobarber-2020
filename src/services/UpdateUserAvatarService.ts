import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import User from '../models/User';

import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

interface UpdateUserAvatarRequest {
  userId: string;
  avatarFileName: string;
}

class UpdateUserAvatarService {
  public async execute({ userId, avatarFileName }: UpdateUserAvatarRequest): Promise<User> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne(userId);

    if (!user) {
      throw new AppError('Must be authenticated to execute this operation', 401);
    }

    // Deleta avatar 'antigo', caso exista
    if (user.avatar) {
      const oldAvatarPath = path.join(uploadConfig.directory, user.avatar);
      const hasAvatar = await fs.promises.stat(oldAvatarPath);

      if (hasAvatar) {
        await fs.promises.unlink(oldAvatarPath);
      }
    }

    user.avatar = avatarFileName;

    await userRepository.save(user);

    delete user.password;
    return user;
  }
}

export default UpdateUserAvatarService;
