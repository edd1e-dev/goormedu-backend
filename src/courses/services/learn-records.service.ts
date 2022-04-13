import {
  DeleteLearnRecordByStudentIdDTO,
} from '../dtos/learn-records.dto';
import { Repository } from 'typeorm';
import { CustomError, IService } from '@/commons/interfaces';
import LearnRecord from '@/courses/entities/learn-record.entity';
import AppDataSource from '@/commons/db';
import {
  FindLearnRecordDTO,
  FindCourseIdsByStudentIdDTO,
  CreateLearnRecordDTO,
  UpdateLearnRecordDTO,
} from '@/courses/dtos/learn-records.dto';

export default class LearnRecordsService implements IService {
  private readonly learnRecordRepository: Repository<LearnRecord>;

  constructor() {
    this.learnRecordRepository = AppDataSource.getRepository(LearnRecord);
  }

  async findLearnRecord({
    where,
    select,
  }: FindLearnRecordDTO): Promise<LearnRecord> {
    const result = await this.learnRecordRepository.findOne({
      where,
      ...(select && { select }),
    });
    if (!result) {
      throw new CustomError('수강 기록이 존재하지 않습니다.');
    }
    return result;
  }

  async findCourseIdsByStudentId({
    student_id,
  }: FindCourseIdsByStudentIdDTO): Promise<number[]> {
    const result = await this.learnRecordRepository.find({
      where: { student_id },
      select: { course_id: true },
    });
    return result.map((obj) => obj.course_id);
  }

  async createLearnRecord(dto: CreateLearnRecordDTO): Promise<LearnRecord> {
    const result = await this.learnRecordRepository.save(
      this.learnRecordRepository.create(dto),
    );
    return result;
  }

  async updateLearnRecord({
    where,
    data,
  }: UpdateLearnRecordDTO): Promise<LearnRecord> {
    const learnRecord = await this.learnRecordRepository.findOne({ where });
    if (!learnRecord) throw new CustomError('수강 기록이 존재하지 않습니다.');
    for (const [key, val] of Object.entries(data)) learnRecord[key] = val;
    const result = await this.learnRecordRepository.save(learnRecord);
    return result;
  }
}
