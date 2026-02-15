import mongoose, { Schema, Model } from 'mongoose';
import { IUser, IUserMethods } from './user.interface';

type UserModel = Model<IUser, Record<string, never>, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    roleId: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
      index: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.isPasswordChangedAfter = function (jwtTimestamp: number) {
  if (this.passwordChangedAt) {
    return jwtTimestamp * 1000 < this.passwordChangedAt.getTime();
  }
  return false;
};

export const User = mongoose.model<IUser, UserModel>('User', userSchema);
