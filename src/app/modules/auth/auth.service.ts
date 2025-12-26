import status from 'http-status';
import AppError from '../../errors/appError';
import { hashPassword, comparePassword } from '../../utils/hash';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { User } from '../user/user.model';
import crypto from 'node:crypto';
import config from '../../config';

const register = async (email: string, password: string) => {
  const exists = await User.findOne({ email });
  if (exists) {
    throw new AppError(status.CONFLICT, 'User already exists');
  }

  const hashed = await hashPassword(password);
  await User.create({ email, password: hashed });
};

const login = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw new AppError(status.UNAUTHORIZED, 'Invalid credentials');

  const ok = await comparePassword(password, user.password);
  if (!ok) throw new AppError(status.UNAUTHORIZED, 'Invalid credentials');

  const payload = { sub: user.id };

  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
};

const refreshAccessToken = async (refreshToken: string) => {
  const decoded = verifyRefreshToken(refreshToken);

  const user = await User.findById(decoded.sub);
  if (!user) throw new AppError(status.UNAUTHORIZED, 'Invalid token');

  if (decoded.iat && user.isPasswordChangedAfter(decoded.iat)) {
    throw new AppError(status.UNAUTHORIZED, 'Token expired');
  }

  return signAccessToken({ sub: user.id });
};

const changePassword = async (userId: string, currentPassword: string, newPassword: string) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new AppError(status.NOT_FOUND, 'User not found');

  const ok = await comparePassword(currentPassword, user.password);
  if (!ok) throw new AppError(status.UNAUTHORIZED, 'Invalid password');

  user.password = await hashPassword(newPassword);
  user.passwordChangedAt = new Date();
  await user.save();
};

const generateResetToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const hashed = crypto.createHash('sha256').update(token).digest('hex');

  return { token, hashed };
};

const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) return;

  const { token, hashed } = generateResetToken();

  user.passwordResetToken = hashed;
  user.passwordResetExpires = new Date(
    Date.now() + config.password_reset_expires_in,
  );
  await user.save();

  console.log('Password reset token:', token);

  return token;
};

const resetPassword = async (token: string, newPassword: string) => {
  const hashed = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashed,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError(status.BAD_REQUEST, 'Invalid or expired token');
  }

  user.password = await hashPassword(newPassword);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordChangedAt = new Date();

  await user.save();
};

export const authServices = {
  register,
  login,
  refreshAccessToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
