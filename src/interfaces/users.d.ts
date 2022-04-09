import UserRole from '@/commons/user-role';

interface IUserPublic {
  id: number;
  username: string;
  role: UserRole;
}
interface IUserDetail {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}
