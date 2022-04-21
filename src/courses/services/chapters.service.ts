import { Repository } from 'typeorm';
import { CustomError, IService } from '@/commons/interfaces';
import Chapter from '../entities/chapter.entity';
import AppDataSource from '@/commons/db';
import {
  CreateChapterDTO,
  DeleteChaptersDTO,
  DeleteChapterDTO,
  FindChaptersByCourseId,
  FindChapterByChapterAndCourseId,
  UpdateChapterDTO,
  UpdateChapterOrdersDTO,
} from '../dtos/chapters.dto';

export default class ChaptersService implements IService {
  private readonly chapterRepository: Repository<Chapter>;

  constructor() {
    this.chapterRepository = AppDataSource.getRepository(Chapter);
  }

  async findChaptersByCourseId({
    course_id,
    select,
  }: FindChaptersByCourseId): Promise<Chapter[]> {
    const result = await this.chapterRepository.find({
      where: { course_id },
      ...(select && { select }),
    });
    return result;
  }

  async findChapterByChapterAndCourseId({
    chapter_id,
    course_id,
    select,
  }: FindChapterByChapterAndCourseId): Promise<Chapter> {
    const result = await this.chapterRepository.findOne({
      where: { id: chapter_id, course_id },
      ...(select && { select }),
    });
    if (!result) throw new CustomError('해당 챕터가 코스에 존재하지 않습니다.');
    return result;
  }

  async createChapter({ where, data }: CreateChapterDTO): Promise<Chapter> {
    const result = await this.chapterRepository.save(
      this.chapterRepository.create({ ...where, ...data }),
    );
    return result;
  }

  async updateChapter({ where, data }: UpdateChapterDTO): Promise<Chapter> {
    const chapter = await this.chapterRepository.findOne({ where });
    if (!chapter) throw new CustomError('챕터가 존재하지 않습니다.');
    for (const [key, val] of Object.entries(data)) {
      chapter[key] = val;
    }
    const result = await this.chapterRepository.save(chapter);
    return result;
  }
  async updateChapterOrders({
    teacher_id,
    data,
  }: UpdateChapterOrdersDTO): Promise<number[]> {
    const chpters = data.chapters;

    await this.chapterRepository.manager.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        for (let i = 0; i < chpters.length; i++) {
          const chapter = await this.chapterRepository.findOne({
            where: { teacher_id, id: chpters[i] },
          });

          if (!chapter) throw new CustomError('챕터가 존재하지 않습니다.');
          chapter.order = i;
          await transactionalEntityManager.save(chapter);
        }
      },
    );
    return chpters;
  }
  async deleteChapter(dto: DeleteChapterDTO): Promise<DeleteChapterDTO> {
    await this.chapterRepository.delete(dto);
    return dto;
  }
  async deleteChapters(dto: DeleteChaptersDTO): Promise<DeleteChaptersDTO> {
    await this.chapterRepository.delete(dto);
    return dto;
  }
}
