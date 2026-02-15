import status from 'http-status';
import AppError from '../../errors/appError';
import { Role } from './role.model';
import { Permission } from './permission.model';
import { RolePermission } from './rolePermission.model';
import { SYSTEM_ROLE } from './rbac.config';

const normalize = (v: string) => v.trim().toLowerCase();

// Roles
export const createRole = async (name: string, description?: string) => {
  name = normalize(name);
  if (name === SYSTEM_ROLE.SUPER_ADMIN) {
    throw new AppError(status.FORBIDDEN, 'Cannot create system role');
  }

  const exists = await Role.findOne({ name });
  if (exists) {
    throw new AppError(status.CONFLICT, 'Role already exists');
  }

  return Role.create({ name, description });
};

export const getRoles = async () => {
  return Role.find().lean();
};

export const updateRole = async (
  roleId: string,
  payload: { name?: string; description?: string },
) => {
  const role = await Role.findById(roleId);
  if (!role) throw new AppError(status.NOT_FOUND, 'Role not found');

  if (role.isSystem || role.name === SYSTEM_ROLE.SUPER_ADMIN) {
    throw new AppError(status.FORBIDDEN, 'System role cannot be modified');
  }

  if (payload.name) role.name = normalize(payload.name);
  if (payload.description) role.description = payload.description;

  return role.save();
};

export const softDeleteRole = async (roleId: string) => {
  const role = await Role.findById(roleId);
  if (!role) throw new AppError(status.NOT_FOUND, 'Role not found');

  if (role.isSystem) {
    throw new AppError(status.FORBIDDEN, 'System role cannot be deleted');
  }

  const assigned = await RolePermission.exists({ roleId });
  if (assigned) {
    throw new AppError(
      status.BAD_REQUEST,
      'Cannot delete role with assigned permissions',
    );
  }

  role.isActive = false;
  await role.save();
};

// Permissions
export const createPermission = async (resource: string, action: string, description?: string) => {

  resource = normalize(resource);
  action = normalize(action);

  const exists = await Permission.findOne({ resource, action });
  if (exists) {
    throw new AppError(status.CONFLICT, 'Permission already exists');
  }

  return Permission.create({ resource, action, description });
};

export const getPermissions = async () => {
  return Permission.find().lean();
};

// Role ↔ Permission Assignment
export const assignPermissionToRole = async (roleId: string, permissionId: string) => {
  const role = await Role.findById(roleId);
  if (!role) throw new AppError(status.NOT_FOUND, 'Role not found');

  if (role.isSystem) {
    throw new AppError(status.FORBIDDEN, 'Cannot modify system role');
  }

  const permission = await Permission.findById(permissionId);
  if(!permission) throw new AppError(status.NOT_FOUND, 'Permission Id is Invalid');

  const exists = await RolePermission.exists({
    roleId,
    permissionId,
  });

  if (exists) throw new AppError(status.BAD_REQUEST, "Permission Already Exists");

  return RolePermission.create({ roleId, permissionId });
};

export const removePermissionFromRole = async (roleId: string, permissionId: string) => {
  const role = await Role.findById(roleId);

  if (role?.isSystem) {
    throw new AppError(status.FORBIDDEN, 'Cannot modify system role');
  }

  return RolePermission.deleteOne({ roleId, permissionId });
};
