import User from './users.entity';
import AppDataSource from '../db';

export default class UsersService {
  #userRepository;

  constructor() {
    this.#userRepository = AppDataSource.getRepository(User);
  }

  async findUserProfile(userId) {
    try {
      const id = userId;
      const userData = await this.#userRepository.findOneBy({ id });

      if (userData) {
        const { sub, ...result } = userData;
        return result;
      }

      return null;
    } catch {
      return null;
    }
  }

  async deleteUserById(userId) {
    try {
      const id = userId;
      const user = await this.#userRepository.delete({ id });

      if (user) {
        return user;
      }
      return null;
    } catch {
      return null;
    }
  }

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
    } catch {
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
    } catch {
      return null;
    }
  }
}
