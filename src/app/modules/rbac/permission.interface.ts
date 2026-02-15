import { Types } from 'mongoose';

export interface IPermission {
  _id: Types.ObjectId;
  resource: string; 
  action: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}