import mongoose from 'mongoose';
import { Role } from './role.model';
import { Permission } from './permission.model';
import { RolePermission } from './rolePermission.model';

export const hasPermission = async (
  roleId: string,
  resource: string,
  action: string,
): Promise<boolean> => {
  if (!mongoose.Types.ObjectId.isValid(roleId)) return false;

  // Super Admin bypass
  const role = await Role.findById(roleId).lean();
  if (!role || role.isActive === false) return false;

  if (role.isSystem) return true;

  const permission = await Permission.findOne({
    resource,
    action,
  }).lean();

  if (!permission) return false;

  const exists = await RolePermission.exists({
    roleId,
    permissionId: permission._id,
  });

  return Boolean(exists);
};
