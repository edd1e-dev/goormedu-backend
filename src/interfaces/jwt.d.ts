import UserRole from '@/commons/user-role';
import { Request } from 'express';

interface jwtPayload {
  id: number;
  role: UserRole;
}

declare global {
  namespace Express {
    interface User extends jwtPayload {}
  }
}
