import jwt, { SignOptions } from 'jsonwebtoken';
import { getEnv } from '../config/env';

export const generateToken = (id: string): string => {
  const { JWT_SECRET, JWT_EXPIRES_IN } = getEnv();
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN as SignOptions['expiresIn'] };
  return jwt.sign({ id }, JWT_SECRET, options);
};
