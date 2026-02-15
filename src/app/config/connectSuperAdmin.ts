import config from '.';
import { User } from '../modules/user/user.model';
import { Role } from '../modules/rbac/role.model';
import { hashPassword } from '../utils/hash';
import { SYSTEM_ROLE } from '../modules/rbac/rbac.config';

export const connectSuperAdmin = async (): Promise<void> => {
  if (!config.super_admin_email || !config.super_admin_password) return;

  const superAdminRole = await Role.findOne({
    name: SYSTEM_ROLE.SUPER_ADMIN,
  });

  if (!superAdminRole) {
    console.warn('Super admin role not found. Skipping super admin initialization.');
    return;
  }

  const exists = await User.findOne({
    roleId: superAdminRole._id,
  });

  if (exists) return;

  const hashedPassword = await hashPassword(config.super_admin_password);

  await User.create({
    email: config.super_admin_email,
    password: hashedPassword,
    roleId: superAdminRole._id,
  });

  console.info('Super Admin account initialized');
};
