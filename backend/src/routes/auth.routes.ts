import { Router } from 'express';
import { registerUser, loginUser, getMe } from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';
import { authRateLimiter } from '../middlewares/rateLimit.middleware';
import { validate } from '../middlewares/validate.middleware';
import { loginSchema, registerSchema } from '../validators/auth.validator';

const router = Router();

router.post('/register', authRateLimiter, validate(registerSchema), registerUser);
router.post('/login', authRateLimiter, validate(loginSchema), loginUser);
router.get('/me', protect, getMe);

export default router;
