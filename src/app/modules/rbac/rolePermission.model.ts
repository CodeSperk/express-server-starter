import mongoose, { Schema, Model } from 'mongoose';
import { IRolePermission } from './rolePermission.interface';

type RolePermissionModel = Model<IRolePermission>;

const rolePermissionSchema = new Schema<IRolePermission>(
  {
    roleId: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
      index: true,
    },
    permissionId: {
      type: Schema.Types.ObjectId,
      ref: 'Permission',
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

// Prevent duplicate grants
rolePermissionSchema.index(
  { roleId: 1, permissionId: 1 },
  { unique: true },
);

export const RolePermission = mongoose.model<
  IRolePermission,
  RolePermissionModel
>('RolePermission', rolePermissionSchema);
