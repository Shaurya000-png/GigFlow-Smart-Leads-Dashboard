import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { asyncHandler } from '../utils/asyncHandler';
import { generateToken } from '../utils/generateToken';
import { AuthRequest } from '../types';
import { sendSuccess } from '../utils/apiResponse';
import { getEnv } from '../config/env';

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  const env = getEnv();

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(409);
    throw new Error('User already exists');
  }

  const assignedRole =
    env.ALLOW_ADMIN_REGISTER === 'true' && role === 'admin' ? 'admin' : 'sales';

  const user = await User.create({
    name,
    email,
    password,
    role: assignedRole,
  });

  sendSuccess(
    res,
    'User registered successfully',
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    },
    201
  );
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.comparePassword(password))) {
    sendSuccess(res, 'Login successful', {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
    return;
  }

  res.status(401);
  throw new Error('Invalid email or password');
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user;
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  sendSuccess(res, 'User profile fetched successfully', {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});
