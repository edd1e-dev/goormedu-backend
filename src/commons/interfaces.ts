import { JwtPayload } from '@/jwt/jwt.dto';
import { Router } from 'express';

export interface IEnv {
  PORT: number;

  DOMAIN: string;
  CLIENT_DOMAIN: string;

  GOOGLE_CLIENT_ID: string;
  GOOGLE_SECRET: string;

  JWT_PRIVATEKEY: string;

  DB_HOST: string;
  DB_PORT: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
}

export enum UserRole {
  Admin = 'Admin',
  Student = 'Student',
  Teacher = 'Teacher',
}

declare global {
  namespace Express {
    interface User extends JwtPayload {}
  }
}

export interface IUserPublic {
  id: number;
  username: string;
  role: UserRole;
}

export interface IUserDetail {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

export interface IController {
  readonly route: string;
  getRouter(): Router;
}

export interface IService {}

export class CustomError extends Error {
  static readonly ErrorType = 'CustomError';
  static readonly UnExpectedErrorMessage = '예기치 않은 오류가 발생했습니다.';

  constructor(message: string = '') {
    super(message);
    this.name = CustomError.ErrorType;
  }
}
