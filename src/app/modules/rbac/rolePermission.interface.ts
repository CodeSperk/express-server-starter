import { Types } from 'mongoose';

export interface IRolePermission {
  roleId: Types.ObjectId;
  permissionId: Types.ObjectId;
}