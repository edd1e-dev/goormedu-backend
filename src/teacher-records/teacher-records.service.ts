import TeacherRecord from './teacher-record.entity';
import AppDataSource from '@/commons/db';
import { CustomError, IService } from '@/commons/interfaces';
import { Repository } from 'typeorm';
import {
  CreateTeacherRecordDTO,
  DeleteTeacherRecordByUserIdDTO,
  FindTeacherRecordByUserIdDTO,
  UpdateTeacherRecordByUserIdDTO,
} from './teacher-records.dto';

export default class TeacherRecordsService implements IService {
  private readonly teacherRecordRepository: Repository<TeacherRecord>;

  constructor() {
    this.teacherRecordRepository = AppDataSource.getRepository(TeacherRecord);
  }

  async createTeacherRecord({
    user_id,
    data,
  }: CreateTeacherRecordDTO): Promise<TeacherRecord> {
    const result = await this.teacherRecordRepository.save(
      this.teacherRecordRepository.create({
        user_id,
        ...data,
      }),
    );
    return result;
  }

  async findAllTeacherRecords(): Promise<TeacherRecord[]> {
    const result = await this.teacherRecordRepository.find();
    return result;
  }
  async findTeacherRecordByUserId({
    user_id,
  }: FindTeacherRecordByUserIdDTO): Promise<TeacherRecord> {
    const result = await this.teacherRecordRepository.findOne({
      where: { user_id },
    });
    if (!result) {
      throw new CustomError('해당 정보가 존재하지 않습니다.');
    }
    return result;
  }
  async updateTeacherRecordByUserId({
    user_id,
    data,
  }: UpdateTeacherRecordByUserIdDTO): Promise<TeacherRecord> {
    const record = await this.teacherRecordRepository.findOne({
      where: { user_id },
    });
    if (!record) {
      throw new CustomError('해당 정보가 존재하지 않습니다.');
    }
    for (const [key, val] of Object.entries(data)) {
      record[key] = val;
    }
    const result = await this.teacherRecordRepository.save(record);
    return result;
  }
  async deleteTeacherRecordByUserId({
    user_id,
  }: DeleteTeacherRecordByUserIdDTO): Promise<{ user_id: number }> {
    await this.teacherRecordRepository.delete({ user_id });
    return { user_id };
  }
}
