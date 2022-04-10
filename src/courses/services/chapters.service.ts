import { Repository } from 'typeorm';
import { CustomError, IService } from '@/commons/interfaces';
import Chapter from '../entities/chapter.entity';
import AppDataSource from '@/commons/db';
import {
  CreateChapterDTO,
  DeleteChaptersDTO,
  DeleteChapterDTO,
  FindChaptersByCourseId,
  UpdateChapterDTO,
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
  async deleteChapter(dto: DeleteChapterDTO): Promise<DeleteChapterDTO> {
    await this.chapterRepository.delete(dto);
    return dto;
  }
  async deleteChapters(dto: DeleteChaptersDTO): Promise<DeleteChaptersDTO> {
    await this.chapterRepository.delete(dto);
    return dto;
  }
}
