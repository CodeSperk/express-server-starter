import { asyncHandler } from '../../errors';
import { authServices } from './auth.service';

const register = asyncHandler(async (req, res) => {
  const { email, password, roleId } = req.body;

  await authServices.register(email, password, roleId);
  res.status(201).json({ success: true });
});

const login = asyncHandler(async (req, res) => {
  const tokens = await authServices.login(req.body.email, req.body.password);
  res.json({ success: true, ...tokens });
});

const logout = asyncHandler(async (_req, res) => {
  res.json({ success: true });
});

const refresh = asyncHandler(async (req, res) => {
  const accessToken = await authServices.refreshAccessToken(req.body.refreshToken);
  res.json({ success: true, accessToken });
});

const changePassword = asyncHandler(async (req, res) => {
  await authServices.changePassword(req.user.sub, req.body.currentPassword, req.body.newPassword);
  res.json({ success: true });
});

const forgotPassword = asyncHandler(async (req, res) => {
  await authServices.forgotPassword(req.body.email);
  res.json({ success: true });
});

const resetPassword = asyncHandler(async (req, res) => {
  await authServices.resetPassword(req.body.token, req.body.password);
  res.json({ success: true });
});

export const authControllers = {
  register,
  login,
  logout,
  refresh,
  changePassword,
  forgotPassword,
  resetPassword,
};
