export const SYSTEM_ROLE = {
  SUPER_ADMIN: 'super_admin',
} as const;

export const RBAC_PERMISSIONS = [
  { resource: 'rbac', action: 'manage' },

  { resource: 'user', action: 'create' },


] as const;
