import User from './users.entity';
import AppDataSource from '@/db';
import { Repository } from 'typeorm';

export default class UsersService {
  #userRepository;

  constructor() {
    this.#userRepository = AppDataSource.getRepository(User);
  }

  /**
   * @param {*} userId User Entity의 id
   * @returns 성공 시 sub가 제외된 User Entity 실패 시 null
   */
  async findUserProfile(userId) {
    try {
      const id = userId;
      const userData = await this.#userRepository.findOneBy({ id });

      if (userData) {
        const { sub, ...result } = userData;
        return result;
      }

      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  /**
   * @param {*} userId User Entity의 id
   * @returns 성공 시 User Entity 실패 시 null
   */
  async deleteUserById(userId) {
    try {
      const id = userId;
      const user = await this.#userRepository.delete({ id });

      if (user) {
        return user;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  /**
   * @param {*} userId User Entity의 id
   * @param {*} newRole UserRole 객체
   * @returns 성공 시 sub가 제외된 User Entity 실패 시 null
   */
  async updateUserRole(userId, newRole) {
    try {
      const id = userId;
      const userData = await this.#userRepository.findOneBy({ id });

      if (userData) {
        userData.role = newRole;
        const { sub, ...result } = await this.#userRepository.save(userData);
        return result;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findUserById(userId) {
    try {
      const id = userId;
      const userData = await this.#userRepository.findOneBy({ id });

      if (userData) {
        const { sub, email, created_at, updated_at, ...result } = userData;
        return result;
      }

      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
