import {
  FindCompletionRecordDTO,
  CreateCompletionRecordDTO,
  CountCompletionRecordDTO,
} from './../dtos/completion-records.dto';
import AppDataSource from '@/commons/db';
import { CustomError, IService } from '@/commons/interfaces';
import { Repository } from 'typeorm';
import CompletionRecord from '../entities/completion-record.entitiy';

export default class CompletionRecordsService implements IService {
  private readonly completionRecordRepository: Repository<CompletionRecord>;

  constructor() {
    this.completionRecordRepository =
      AppDataSource.getRepository(CompletionRecord);
  }

  async findCompletionRecord({
    where,
    select,
  }: FindCompletionRecordDTO): Promise<CompletionRecord> {
    const result = await this.completionRecordRepository.findOne({
      where,
      ...(select && { select }),
    });

    if (!result) {
      throw new CustomError('이수 기록이 존재하지 않습니다.');
    }
    return result;
  }

  async createCompletionRecord(
    dto: CreateCompletionRecordDTO,
  ): Promise<CompletionRecord> {
    const result = await this.completionRecordRepository.save(
      this.completionRecordRepository.create(dto),
    );
    return result;
  }

  async countCompletionRecord({
    student_id,
    course_id,
  }: CountCompletionRecordDTO): Promise<number> {
    const result = await this.completionRecordRepository.find({
      where: { student_id, course_id },
      select: { lecture_id: true },
    });
    return result.length;
  }
}
