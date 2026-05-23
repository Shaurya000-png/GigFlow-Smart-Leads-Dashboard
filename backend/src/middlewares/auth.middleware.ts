import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, IUser } from '../types';
import { asyncHandler } from '../utils/asyncHandler';
import { User } from '../models/user.model';
import { getEnv } from '../config/env';

interface JwtPayload {
  id: string;
}

export const protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.headers.authorization?.startsWith('Bearer')) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  const token = req.headers.authorization.split(' ')[1];
  const { JWT_SECRET } = getEnv();
  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

  const userDoc = await User.findById(decoded.id).select('-password');
  if (!userDoc) {
    res.status(401);
    throw new Error('Not authorized, user not found');
  }

  req.user = userDoc.toObject() as unknown as IUser;
  next();
});
