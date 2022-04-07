import jwt from 'jsonwebtoken';
import User from '../users/users.entity';
import AppDataSource from '../db';
import { UserRole } from '../users/users.constant';

export default class AuthService {
  #userRepository;

  constructor() {
    this.#userRepository = AppDataSource.getRepository(User);
  }

  async findUserBySub(userData) {
    try {
      const { sub } = userData;
      const user = await this.#userRepository.findOneBy({ sub });

      if (user) {
        return user;
      }

      return null;
    } catch {
      return null;
    }
  }

  async createNewUser(userData) {
    try {
      const { sub, email, picture, displayName } = userData;
      const newUserData = userRepository.create({
        email,
        username: displayName,
        sub,
        role: UserRole.Student,
        thumbnail: picture,
      });
      const createdUserData = await userRepository.save(newUserData);
      if (createdUserData) {
        return createdUserData;
      }
      return null;
    } catch {
      return null;
    }
  }

  async saveNewUser(newUserData) {
    try {
      const user = await userRepository.save(newUserData);

      if (user) {
        return user;
      }

      return null;
    } catch {
      return null;
    }
  }

  async confirmAuthStatus(userId) {
    try {
      const id = userId;
      const userData = await AppDataSource.getRepository(User).findOneBy({
        id,
      });

      if (userData) {
        return userData;
      }

      return null;
    } catch {
      return null;
    }
  }
}
