import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import { authorize } from '../../middlewares/authorize';
import * as controller from './rbac.admin.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import {
  assignPermissionSchema,
  createPermissionSchema,
  createRoleSchema,
  updateRoleSchema,
} from './rbac.validation';

const router = Router();

// * Permission: rbac:manage *
router.use(authGuard, authorize('rbac', 'manage'));

router.post('/create-role', validateRequest(createRoleSchema), controller.createRole);
router.get('/roles', controller.getRoles);
router.patch('/roles/:roleId', validateRequest(updateRoleSchema), controller.updateRole);
router.delete('/roles/:roleId', controller.deleteRole);

router.post('/permissions', validateRequest(createPermissionSchema), controller.createPermission);
router.get('/permissions', controller.getPermissions);

router.post('/assign', validateRequest(assignPermissionSchema), controller.assignPermission);
router.post('/remove', controller.removePermission);

export const rbacAdminRoutes = router;
