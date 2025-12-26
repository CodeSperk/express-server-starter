export type TJwtPayload = {
  sub: string;
  iat?: number;
  exp?: number;
};