import { Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  roleId: Types.ObjectId;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  isPasswordChangedAfter(jwtTimestamp: number): boolean;
}

