import config from '.';
import { USER_ROLE } from '../modules/user/user.constants';
import { User } from '../modules/user/user.model';
import { hashPassword } from '../utils/hash';

export const connectSuperAdmin = async (): Promise<void> => {
  if (!config.super_admin_email || !config.super_admin_password) return;

  const exists = await User.findOne({
    role: USER_ROLE.SUPER_ADMIN,
  });
  if (exists) return;

  const hashedPassword = await hashPassword(config.super_admin_password);

  await User.create({
    email: config.super_admin_email,
    password: hashedPassword,
    role: USER_ROLE.SUPER_ADMIN,
  });

  console.info('Super Admin account initialized');
};
