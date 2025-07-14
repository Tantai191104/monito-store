/**
 * Node modules
 */
import { NextFunction, Request, Response } from 'express';

/**
 * Utils
 */
import { verifyToken } from '../utils/jwt';
import { UnauthorizedException } from '../utils/errors';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token = req.cookies?.accessToken;

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET!);

    // Fetch user and check tokenVersion
    import('../models/userModel').then(({ default: UserModel }) => {
      UserModel.findById(decoded.userId).then((user) => {
        if (!user || user.tokenVersion !== decoded.tokenVersion) {
          next(new UnauthorizedException('Invalid token'));
        } else {
          req.userId = decoded.userId;
          next();
        }
      }).catch(() => {
        next(new UnauthorizedException('Invalid token'));
      });
    });
    return;
  } catch (error) {
    next(new UnauthorizedException('Invalid token'));
  }
};
