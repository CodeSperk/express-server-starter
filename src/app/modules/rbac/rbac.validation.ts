import { z } from 'zod';

const objectId = z.string().length(24);

//role validations
export const createRoleSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    description: z.string().optional(),
  }),
});

export const updateRoleSchema = z.object({
  params: z.object({
    roleId: objectId,
  }),
  body: z.object({
    name: z.string().min(2).max(50).optional(),
    description: z.string().max(255).optional(),
  }),
});

//permission validation
export const createPermissionSchema = z.object({
  body: z.object({
    resource: z.string().min(2).max(50).regex(/^[a-z_]+$/),
    action: z.string().min(2).max(30).regex(/^[a-z_]+$/),
    description: z.string().max(255).optional(),
  }),
});

// permission assignment validation
export const assignPermissionSchema = z.object({
  body: z.object({
    roleId: objectId,
    permissionId: objectId,
  }),
});