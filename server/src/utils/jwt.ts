import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';

export const generateTokens = (payload: { userId: string; tokenVersion: number }) => {
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE as StringValue,
  });

  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE as StringValue,
  });
  return { accessToken, refreshToken };
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as jwt.JwtPayload & { userId: string; tokenVersion: number };
};
