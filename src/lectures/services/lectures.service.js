import AppDataSource from '../../db';
import Lecture from '../entities/lecture.entity';

export default class LecturesService {
  #lectureRepository;
  constructor(otherService) {
    this.#lectureRepository = AppDataSource.getRepository(Lecture);
  }

  /**
   *
   * @param id lecture id
   * @param select
   * @returns lecture | null
   */
  async findLectureById({ id, select }) {
    try {
      const result = await this.#lectureRepository.findOneOrFail({
        where: { id },
        ...(select && { select }),
      });
      return result;
    } catch {
      return null;
    }
  }

  /**
   *
   * @param data title, video_url?, content?, order, is_public?, chapter_id, course_id, teacher_id,
   * @returns lecture | null
   */
  async createLecture(data) {
    try {
      const result = await this.#lectureRepository.save(
        this.#lectureRepository.create({ ...data })
      );
      return result;
    } catch {
      return null;
    }
  }

  /**
   *
   * @param where  id, teacher_id
   * @param data  변경할 데이터
   * @returns lecture | null
   */
  async updateLecture({ where, data: { video_url, ...rest } }) {
    try {
      const lecture = await this.#lectureRepository.findOneOrFail({ where });
      for (const [key, val] of Object.entries(rest)) lecture[key] = val;
      if (video_url) {
        // s3에서 기존의 데이터 삭제 요청
        lecture.video_url = video_url;
      }
      const result = await this.#lectureRepository.save(lecture);
      return result;
    } catch {
      return null;
    }
  }

  /**
   *
   * @param id lecture id
   * @param teacher_id
   * @returns '{ id }' | null
   */
  async deleteLecture({ id, teacher_id }) {
    try {
      const { video_url } = await this.#lectureRepository.findOneOrFail({
        where: { id, teacher_id },
        select: { video_url: true },
      });
      if (video_url) {
        // s3에서 데이터 삭제 요청
      }
      await this.#lectureRepository.delete({ id, teacher_id });
      return { id };
    } catch {
      return null;
    }
  }
}
