import mongoose, { Schema, Model } from 'mongoose';
import { IPermission } from './permission.interface';

type PermissionModel = Model<IPermission>;

const permissionSchema = new Schema<IPermission>(
  {
    resource: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true },
);

// Prevent duplicates like bookings:read twice
permissionSchema.index({ resource: 1, action: 1 }, { unique: true });

export const Permission = mongoose.model<IPermission, PermissionModel>(
  'Permission',
  permissionSchema,
);
