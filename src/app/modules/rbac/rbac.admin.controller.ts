import { asyncHandler } from '../../errors';
import * as service from './rbac.admin.service';

export const createRole = asyncHandler(async (req, res) => {
  const role = await service.createRole(req.body.name, req.body.description);
  res.status(201).json({ success: true, data: role });
});

export const getRoles = asyncHandler(async (_req, res) => {
  const roles = await service.getRoles();
  res.json({ success: true, data: roles });
});

export const updateRole = asyncHandler(async (req, res) => {
  const role = await service.updateRole(req.params.roleId, req.body);

  res.json({ success: true, data: role });
});

export const deleteRole = asyncHandler(async (req, res) => {
  await service.softDeleteRole(req.params.roleId);
  res.json({ success: true });
});

// permissions
export const createPermission = asyncHandler(async (req, res) => {
  const permission = await service.createPermission(
    req.body.resource,
    req.body.action,
    req.body.description,
  );
  res.status(201).json({ success: true, data: permission });
});

export const getPermissions = asyncHandler(async (_req, res) => {
  const permissions = await service.getPermissions();
  res.json({ success: true, data: permissions });
});

export const assignPermission = asyncHandler(async (req, res) => {
  await service.assignPermissionToRole(req.body.roleId, req.body.permissionId);
  res.json({ success: true });
});

export const removePermission = asyncHandler(async (req, res) => {
  await service.removePermissionFromRole(req.body.roleId, req.body.permissionId);
  res.json({ success: true });
});
