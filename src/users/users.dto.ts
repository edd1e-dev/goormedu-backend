import { UserRole } from '@/commons/interfaces';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { FindOptionsSelect } from 'typeorm';
import User from './user.entity';

export class CreateUserDTO {
  constructor({ sub, email, username }: CreateUserDTO) {
    this.email = email;
    this.username = username;
    this.sub = sub;
  }
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  sub: string;
}

export class UpdateRoleData {
  constructor({ role }: UpdateRoleData) {
    this.role = role;
  }
  @IsEnum(UserRole)
  role: UserRole;
}

export class UpdateUserData {
  constructor({ email, username }: UpdateUserData) {
    if (email) this.email = email;
    if (username) this.username = username;
  }
  @IsEmail()
  @IsOptional()
  email?: string;
  @IsString()
  @IsOptional()
  username?: string;
}

export class UserPublic {
  id: number;
  username: string;
  role: UserRole;
}

export class UserDetail extends UserPublic {
  email: string;
  created_at: Date;
  updated_at: Date;
}

export class FindUserByIdDTO {
  id: number;
  select?: FindOptionsSelect<User>;
}

export class FindUserBySubDTO {
  sub: string;
  select?: FindOptionsSelect<User>;
}

export class UpdateUserByIdDTO {
  id: number;
  data: UpdateRoleData | UpdateUserData;
}

export class DeleteUserByIdDTO {
  id: number;
}

export class DeleteUserRecordByIdDTO {
  id: number;
}
