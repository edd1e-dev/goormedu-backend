import { UserRole } from '@/commons/interfaces';
import { IsEnum, IsNumber } from 'class-validator';

export class JwtPayload {
  constructor({ id, role }: JwtPayload) {
    this.id = id;
    this.role = role;
  }
  @IsNumber()
  id: number;

  @IsEnum(UserRole)
  role: UserRole;
}
