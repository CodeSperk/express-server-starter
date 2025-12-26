export const USER_ROLE = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const;

export const USER_ROLES = Object.values(USER_ROLE);
