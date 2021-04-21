import { Router } from 'express';

import CreateUserSessionService from '../services/CreateUserSessionService';

const sessionsRouter = Router();

/**
 * Create a new session
 */
sessionsRouter.post('/', async (request, response) => {
  try {
    const { email, password } = request.body;

    const sessionService = new CreateUserSessionService();

    const user = await sessionService.execute({ email, password });

    return response.json(user);
  } catch (err) {
    response.status(400).json({ message: 'Error', error: err.message });
  }
});

export default sessionsRouter;
