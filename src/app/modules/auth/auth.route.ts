import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import { authControllers } from './auth.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { authValidations } from './auth.validation';
import { authorize } from '../../middlewares/authorize';

const router = Router();

router.post(
  '/register',
  authGuard,
  authorize('user', 'create'),
  validateRequest(authValidations.registerSchema),
  authControllers.register,
);

router.post('/login', validateRequest(authValidations.loginSchema), authControllers.login);

router.post('/logout', validateRequest(authValidations.refreshSchema), authControllers.logout);

router.post('/refresh', validateRequest(authValidations.refreshSchema), authControllers.refresh);

router.post(
  '/change-password',
  authGuard,
  validateRequest(authValidations.changePasswordSchema),
  authControllers.changePassword,
);

router.post(
  '/forgot-password',
  validateRequest(authValidations.forgotPasswordSchema),
  authControllers.forgotPassword,
);

router.post(
  '/reset-password',
  validateRequest(authValidations.resetPasswordSchema),
  authControllers.resetPassword,
);

export const authRoutes = router;
