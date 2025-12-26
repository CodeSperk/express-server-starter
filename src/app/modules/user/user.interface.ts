import { Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'super_admin';
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  isPasswordChangedAfter(jwtTimestamp: number): boolean;
}

export type TUserRole = 'user' | 'admin' | 'super_admin';
