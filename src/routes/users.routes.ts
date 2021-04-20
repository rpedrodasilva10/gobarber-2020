import { Router } from 'express';

import User from '../models/User';
import CreateUserService from '../services/CreateUserService';

const usersRouter = Router();

/**
 * Create a new user
 */
usersRouter.post('/', async (request, response) => {
  try {
    const createUserService = new CreateUserService();

    const { name, password, email }: User = request.body;

    const user = await createUserService.execute({ name, password, email });

    return response.status(201).json(user);
  } catch (err) {
    response
      .status(400)
      .json({ message: 'Could not create user', error: err.message });
  }
});

export default usersRouter;
