import { Router } from 'express';

import CreateUserSessionService from '../services/CreateUserSessionService';

const sessionsRouter = Router();

/**
 * Create a new session
 */
sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const sessionService = new CreateUserSessionService();

  const user = await sessionService.execute({ email, password });

  return response.json(user);
});

export default sessionsRouter;
