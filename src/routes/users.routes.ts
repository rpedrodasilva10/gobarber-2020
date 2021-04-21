import { Router } from 'express';
import multer from 'multer';
import enforceAuthentication from '../middlewares/enforceAuthentication';

import User from '../models/User';
import CreateUserService from '../services/CreateUserService';

import uploadConfig from '../config/upload';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

const usersRouter = Router();
const upload = multer(uploadConfig);
/**
 * Create a new user
 */
usersRouter.post('/', async (request, response) => {
  const createUserService = new CreateUserService();

  const { name, password, email }: User = request.body;

  const user = await createUserService.execute({ name, password, email });

  return response.status(201).json(user);
});

usersRouter.patch('/avatar', enforceAuthentication, upload.single('avatar'), async (request, response) => {
  const updateUserAvatarService = new UpdateUserAvatarService();

  const updatedUser = await updateUserAvatarService.execute({
    userId: request.user.id,
    avatarFileName: request.file.filename,
  });

  return response.json(updatedUser);
});

export default usersRouter;
