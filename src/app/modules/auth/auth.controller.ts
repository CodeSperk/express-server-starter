import { asyncHandler } from '../../errors';
import { authServices } from './auth.service';

const register = asyncHandler(async (req, res) => {
  await authServices.register(req.body.email, req.body.password);
  res.status(201).json({ success: true });
});

const login = asyncHandler(async (req, res) => {
  const tokens = await authServices.login(req.body.email, req.body.password);
  res.json({ success: true, ...tokens });
});

const refresh = asyncHandler(async (req, res) => {
  const accessToken = await authServices.refreshAccessToken(req.body.refreshToken);
  res.json({ success: true, accessToken });
});

const changePassword = asyncHandler(async (req, res) => {
  await authServices.changePassword(req.user.sub, req.body.currentPassword, req.body.newPassword);
  res.json({ success: true });
});

export const authControllers = {
  register,
  login,
  refresh,
  changePassword,
};
