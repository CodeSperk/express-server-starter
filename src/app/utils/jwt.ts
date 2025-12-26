import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../config';
import { TJwtPayload } from '../modules/auth/auth.types';

const accessTokenOptions: SignOptions = {
  expiresIn: config.jwt_access_expires_in,
};

const refreshTokenOptions: SignOptions = {
  expiresIn: config.jwt_refresh_expires_in,
};

export const signAccessToken = (payload: TJwtPayload) =>
  jwt.sign(payload, config.jwt_access_secret, accessTokenOptions);

export const signRefreshToken = (payload: TJwtPayload) =>
  jwt.sign(payload, config.jwt_refresh_secret, refreshTokenOptions);

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, config.jwt_access_secret) as TJwtPayload;

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, config.jwt_refresh_secret) as TJwtPayload;
