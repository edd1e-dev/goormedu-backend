import User from './users.entity';
import AppDataSource from '@/db';
import { Repository } from 'typeorm';
import CustomError from '@/commons/custom-error';
import {
  FindUserByIdDTO,
  DeleteUserByIdDTO,
  UpdateUserByIdDTO,
  CreateUserDTO,
} from './users.dto';

export default class UsersService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  /**
   *
   * @param CreateUserDTO 새로 생성할 사용자의 정보입니다.
   * email, username, sub 데이터를 포함하고 있습니다.
   * @returns 생성된 사용자의 전체 정보를 반환합니다.
   */
  async createUser({ email, username, sub }: CreateUserDTO) {
    const result = await this.userRepository.save(
      this.userRepository.create({ email, username, sub }),
    );
    return result;
  }

  /**
   * @param FindUserByIdDTO 사용자의 id와 결과에 포함할 데이터 설정을 포함합니다.
   * select는 nullable입니다.
   * @returns 사용자의 정보를 전달합니다.
   */
  async findUserById({ id, select }: FindUserByIdDTO): Promise<User> {
    const result = await this.userRepository.findOne({
      where: { id },
      ...(select && { select }),
    });
    if (!result) throw new CustomError('사용자가 존재하지 않습니다.');
    return result;
  }

  /**
   *
   * @param UpdateUserByIdDTO 사용자 id, 변경할 data를 포함합니다.
   * data는 role만 포합하거나 email, username을 포함할 수 있습니다. 이 경우, role을 포함하지 않습니다.
   * @returns 수정된 사용자의 전체 정보를 전달합니다.
   */
  async updateUserById({ id, data }: UpdateUserByIdDTO): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new CustomError('사용자가 존재하지 않습니다.');
    }
    if ('role' in data) {
      user.role = data.role;
    } else {
      for (const [key, val] of Object.entries(data)) user[key] = val;
    }
    const result = await this.userRepository.save(user);
    if (!result) throw new CustomError('요청 결과를 불러오지 못했습니다.');
    return result;
  }

  /**
   * @param id 제거할 사용자의 id입니다.
   * @returns 인자로 전달했던 id를 반환합니다.
   */
  async deleteUserById({ id }: DeleteUserByIdDTO): Promise<{ id: number }> {
    await this.userRepository.delete({ id });
    return { id };
  }
}
