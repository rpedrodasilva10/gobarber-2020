import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '../config/auth';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function enforceAuthentication(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new Error('Authorization header is missing!');
  }

  try {
    const [, token] = authHeader.split(' ');
    const { sub } = verify(token, authConfig.jwt.secret) as TokenPayload;

    request.user = {
      id: sub,
    };

    return next();
  } catch (err) {
    throw new Error('Error decoding token');
  }
}
