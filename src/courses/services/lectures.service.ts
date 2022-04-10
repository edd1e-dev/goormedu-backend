import AppDataSource from '@/commons/db';
import { CustomError, IService } from '@/commons/interfaces';
import { Repository } from 'typeorm';
import {
  CreateLectureDTO,
  DeleteLectureDTO,
  DeleteLecturesDTO,
  FindLectureByIdDTO,
  FindLecturesByChapterIdDTO,
  UpdateLectureDTO,
} from '../dtos/lectures.dto';
import Lecture from '../entities/lecture.entity';

export default class LecturesService implements IService {
  private readonly lectureRepository: Repository<Lecture>;

  constructor() {
    this.lectureRepository = AppDataSource.getRepository(Lecture);
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
  async updateLecutre({
    where,
    data: { video_url, ...rest },
  }: UpdateLectureDTO): Promise<Lecture> {
    const lecture = await this.lectureRepository.findOne({ where });
    if (!lecture) throw new CustomError('강의가 존재하지 않습니다.');

    for (const [key, val] of Object.entries(rest)) lecture[key] = val;
    if (video_url) {
      // 기존의 영상 데이터를 s3에서 제거 요청
      lecture.video_url = video_url;
    }

    const result = await this.lectureRepository.save(lecture);
    return result;
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
