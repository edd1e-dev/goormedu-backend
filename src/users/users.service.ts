import User from './user.entity';
import AppDataSource from '@/commons/db';
import { Repository } from 'typeorm';
import {
  FindUserByIdDTO,
  DeleteUserByIdDTO,
  UpdateUserByIdDTO,
  CreateUserDTO,
  FindUserBySubDTO,
} from './users.dto';
import { CustomError } from '@/commons/interfaces';

export default class UsersService {
  private readonly userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  /**
   *
   * @param createUserDTO 새로 생성할 사용자의 정보입니다.
   * email, username, sub 데이터를 포함하고 있습니다.
   * @returns 생성된 사용자의 전체 정보를 반환합니다.
   */
  async createUser(createUserDTO: CreateUserDTO) {
    const result = await this.userRepository.save(
      this.userRepository.create(createUserDTO),
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
   * @param FindUserBySubDTO sub 데이터로 사용자를 조회, rufrhk
   * sub은 unique한 데이터로 절대 겹치는 경우가 없다.
   * @returns 존재할 경우 해당 사용자의 정보를, 존재하지 않을 경우 null을 반환
   */
  async findUserBySub({ sub, select }: FindUserBySubDTO): Promise<User | null> {
    const result = await this.userRepository.findOne({
      where: { sub },
      ...(select && { select }),
    });
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
