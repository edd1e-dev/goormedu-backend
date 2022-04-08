import User from '../users/users.entity';
import AppDataSource from '../db';
import { UserRole } from '../users/users.constant';

export default class AuthService {
  #userRepository;

  constructor() {
    this.#userRepository = AppDataSource.getRepository(User);
  }

  /**
   * @param {*} userData passport를 통해 받아온 user 객체
   * @returns 성공 시 User Entity 실패 시 null
   */
  async findUserBySub(userData) {
    try {
      const { sub } = userData;
      const user = await this.#userRepository.findOneBy({ sub });

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
   * @param {*} userData Repository를 생성하고 DB에 저장할 User Entity
   * @returns 성공 시 User Entity 실패 시 null
   */
  async createNewUser(userData) {
    try {
      const { sub, email, picture, displayName } = userData;
      const newUserData = this.#userRepository.create({
        email,
        username: displayName,
        sub,
        role: UserRole.Student,
        thumbnail: picture,
      });
      const createdUserData = await this.#userRepository.save(newUserData);
      if (createdUserData) {
        return createdUserData;
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
  async confirmAuthStatus(userId) {
    try {
      const id = userId;
      const userData = await this.#userRepository.findOneBy({
        id,
      });

      if (userData) {
        return userData;
      }

      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
