export type TJwtPayload = {
  sub: string;
  roleId: string;
  iat?: number;
  exp?: number;
};