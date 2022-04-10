import { UserRole } from '@/commons/interfaces';
import { NextFunction, Request, Response } from 'express';

const RoleGuard = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.user && roles.includes(req.user.role)) {
      next();
    } else {
      return res.send({ ok: false, error: '권한이 없습니다.' });
    }
  };
};

export default RoleGuard;
