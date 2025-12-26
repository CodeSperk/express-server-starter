import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import { authControllers } from './auth.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { authValidations } from './auth.validation';

const router = Router();

router.post(
  '/register',
  validateRequest(authValidations.registerSchema),
  authControllers.register,
);

router.post(
  '/login',
  validateRequest(authValidations.loginSchema),
  authControllers.login,
);

router.post(
  '/refresh',
  validateRequest(authValidations.refreshSchema),
  authControllers.refresh,
);

router.post(
  '/change-password',
  authGuard,
  validateRequest(authValidations.changePasswordSchema),
  authControllers.changePassword,
);

export const authRoutes = router;