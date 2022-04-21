import AppDataSource from '@/commons/db';
import { CustomError, IService } from '@/commons/interfaces';
import { Repository } from 'typeorm';
import {
  CreateLectureDTO,
  CreateLectureWithVideoUrlDTO,
  DeleteLectureDTO,
  DeleteLecturesDTO,
  FindLectureByIdDTO,
  FindLecturesByChapterIdDTO,
  FindTempLecturesByCourseIdDTO,
  UpdateLectureDTO,
  UpdateLectureWithVideoUrlDTO,
  UpdateLectureOrdersDTO,
} from '../dtos/lectures.dto';
import Lecture from '../entities/lecture.entity';

export default class LecturesService implements IService {
  private readonly lectureRepository: Repository<Lecture>;

  constructor() {
    this.lectureRepository = AppDataSource.getRepository(Lecture);
  }

  async findTempLecturesByCourseId({
    where,
    select,
  }: FindTempLecturesByCourseIdDTO): Promise<Lecture[]> {
    const result = await this.lectureRepository.find({
      where: { ...where, chapter_id: 0 },
      ...(select && { select }),
    });

    return result;
  }

  async findLecturesByChapterId({
    chapter_id,
    select,
  }: FindLecturesByChapterIdDTO): Promise<Lecture[]> {
    const result = await this.lectureRepository.find({
      where: { chapter_id },
      ...(select && { select }),
    });

    return result;
  }

  async findLectureById({ id, select }: FindLectureByIdDTO): Promise<Lecture> {
    const result = await this.lectureRepository.findOne({
      where: { id },
      ...(select && { select }),
    });
    if (!result) throw new CustomError('강의가 존재하지 않습니다.');
    return result;
  }

  async createLecture({ where, data }: CreateLectureDTO): Promise<Lecture> {
    const result = await this.lectureRepository.save(
      this.lectureRepository.create({ ...where, ...data }),
    );
    return result;
  }

  async createLectureWithVideoUrl({
    where,
    data,
  }: CreateLectureWithVideoUrlDTO): Promise<Lecture> {
    const result = await this.lectureRepository.save(
      this.lectureRepository.create({ ...where, ...data }),
    );
    return result;
  }

  async updateLecutre({
    where,
    data: { ...rest },
  }: UpdateLectureDTO): Promise<Lecture> {
    const lecture = await this.lectureRepository.findOne({ where });
    if (!lecture) throw new CustomError('강의가 존재하지 않습니다.');

    for (const [key, val] of Object.entries(rest)) lecture[key] = val;

    const result = await this.lectureRepository.save(lecture);
    return result;
  }

  async updateLecutreWithVideoUrl({
    where,
    data: { video_url, ...rest },
  }: UpdateLectureWithVideoUrlDTO): Promise<Lecture> {
    const lecture = await this.lectureRepository.findOne({ where });
    if (!lecture) throw new CustomError('강의가 존재하지 않습니다.');

    for (const [key, val] of Object.entries(rest)) lecture[key] = val;
    lecture.video_url = video_url;

    const result = await this.lectureRepository.save(lecture);
    return result;
  }

  async updateLectureOrders({
    teacher_id,
    data,
  }: UpdateLectureOrdersDTO): Promise<number[]> {
    const lectures = data.lectures;

    await this.lectureRepository.manager.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        for (let i = 0; i < lectures.length; i++) {
          const lecture = await this.lectureRepository.findOne({
            where: { teacher_id, id: lectures[i] },
          });

          if (!lecture) throw new CustomError('강의가 존재하지 않습니다.');
          lecture.order = i;
          await transactionalEntityManager.save(lecture);
        }
      },
    );
    return lectures;
  }

  async deleteLecture(dto: DeleteLectureDTO): Promise<DeleteLectureDTO> {
    await this.lectureRepository.delete(dto);
    return dto;
  }

  async deleteLectures(where: DeleteLecturesDTO): Promise<DeleteLecturesDTO> {
    await this.lectureRepository.delete(where);
    return where;
  }
}
