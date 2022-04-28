import {
  FindCompletionRecordDTO,
  CreateCompletionRecordDTO,
  CountCompletionRecordDTO,
  DeleteCompletionRecordsDTO,
  DeleteCompletionRecordByLectureIdDTO,
  DeleteCompletionRecordByStudentIdDTO,
} from './../dtos/completion-records.dto';
import AppDataSource from '@/commons/db';
import { CustomError, IService } from '@/commons/interfaces';
import { DeleteResult, Repository } from 'typeorm';
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

  async checkCompletionRecord({
    where,
    select,
  }: FindCompletionRecordDTO): Promise<CompletionRecord | null> {
    const result = await this.completionRecordRepository.findOne({
      where,
      ...(select && { select }),
    });

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

  async deleteCompletionRecordByLectureId(
    where: DeleteCompletionRecordByLectureIdDTO,
  ): Promise<{ lecture_id }> {
    const { lecture_id } = where;
    await this.completionRecordRepository.delete({ lecture_id });
    return { lecture_id };
  }

  async deleteCompletionRecords(
    where: DeleteCompletionRecordsDTO,
  ): Promise<Object> {
    const findResult = await this.completionRecordRepository.find({ where });
    const deleteResult = await this.completionRecordRepository.delete(where);
    let result: Array<Number> = [];

    if (findResult.length === deleteResult.affected) {
      for (const value of findResult) {
        result.push(value.lecture_id);
      }
    }

    return { lecture_ids: result };
  }

  async deleteCompletionRecordByStudentId({
    student_id,
  }: DeleteCompletionRecordByStudentIdDTO): Promise<{ student_id }> {
    await this.completionRecordRepository.delete({ student_id });
    return { student_id };
  }
}
