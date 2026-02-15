import { Permission } from './permission.model';
import { Role } from './role.model';
import { RolePermission } from './rolePermission.model';
import { RBAC_PERMISSIONS, SYSTEM_ROLE } from './rbac.config';

// Seed System Role
export const seedSystemRoles = async (): Promise<void> => {
  await Role.updateOne(
    { name: SYSTEM_ROLE.SUPER_ADMIN },
    {
      $setOnInsert: {
        name: SYSTEM_ROLE.SUPER_ADMIN,
        isSystem: true,
        description: 'System Super Administrator',
      },
    },
    { upsert: true },
  );

  console.info('[RBAC] System roles ensured');
};

// Sync permissions & auto-assign to Super Admin
export const seedPermissions = async (): Promise<void> => {
  for (const perm of RBAC_PERMISSIONS) {
    await Permission.updateOne(
      { resource: perm.resource, action: perm.action },
      { $setOnInsert: perm },
      { upsert: true },
    );
  }

  const superAdminRole = await Role.findOne({
    name: SYSTEM_ROLE.SUPER_ADMIN,
  });

  if (!superAdminRole) {
    console.warn('[RBAC] Super Admin role missing (should not happen)');
    return;
  }

  // Assign all permissions to Super Admin
  const permissions = await Permission.find({}, '_id').lean();

  for (const permission of permissions) {
    await RolePermission.updateOne(
      {
        roleId: superAdminRole._id,
        permissionId: permission._id,
      },
      { $setOnInsert: {} },
      { upsert: true },
    );
  }

  console.info('[RBAC] Permissions synced & assigned to Super Admin');
};
