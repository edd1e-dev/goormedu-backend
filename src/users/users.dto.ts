import { FindOptionsSelect } from 'typeorm';
import User from './users.entity';

export class UserPublic {
  id: number;
  username: string;
  role: UserRole;
}

export class UserDetail extends User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}
export class CreateUserDTO {
  username: string;
  email: string;
  sub: string;
}
export class FindUserByIdDTO {
  id: number;
  select?: FindOptionsSelect<User>;
}

export class UpdateUserByIdDTO {
  id: number;
  data: UpdateRole | UpdateUser;
}

export class UpdateRole {
  role: UserRole;
}

export class UpdateUser {
  email?: string;
  username?: string;
}

export class DeleteUserByIdDTO {
  id: number;
}
