import AppDataSource from '../../db';
import Lecture from '../entities/lecture.entity';
import CompletionRecordsService from './completion-records.service';

export default class LecturesService {
  #lectureRepository;
  #completionRecordsService;
  constructor() {
    this.#lectureRepository = AppDataSource.getRepository(Lecture);
    this.#completionRecordsService = new CompletionRecordsService();
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
      await Promise.all([
        this.#completionRecordsService.deleteCompletionRecordsByLectureId({
          lecture_id: id,
        }),
        this.#lectureRepository.delete({ id, teacher_id }),
      ]); // 해당 lecture와 CompletionRecord 모두 삭제
      return { id };
    } catch {
      return null;
    }
  }
  /**
   *
   * @param chapter_id  chapter_id 기준으로 삭제
   * @param teacher_id  권한 검증
   * @returns id list | null
   */
  async deleteLecturesByChapterId({ chapter_id, teacher_id }) {
    try {
      const lectures = await this.#lectureRepository.find({
        where: { chapter_id, teacher_id },
        select: { id: true, video_url: true },
      });

      for (const { id, video_url } of lectures) {
        if (video_url) {
          // s3에서 데이터 삭제 요청
        }
        await Promise.all([
          this.#completionRecordsService.deleteCompletionRecordsByLectureId({
            lecture_id: id,
          }),
          this.#lectureRepository.delete({ id, teacher_id }),
        ]);
      }

      return { lecture_ids: lectures.map((lecture) => lecture.id) };
    } catch {
      return null;
    }
  }
}
