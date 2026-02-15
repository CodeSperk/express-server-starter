import { Types } from 'mongoose';

export interface IRole {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  isSystem: boolean;
  isActive?: boolean;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}