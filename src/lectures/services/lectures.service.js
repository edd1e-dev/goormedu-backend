import res from 'express/lib/response';
import AppDataSource from '../db';
import Lecture from './lecture.entity';

export default class LecturesService {
  #lecturRepository;
  constructor(otherTmpService) {
    this.#lecturRepository = AppDataSource.getRepository(Lecture);
  }

  /**
   *
   * @param {*} lecture_id
   * @returns
   */
  async findLectureByLectureId(lecture_id) {
    try {
      const result = await this.#lecturRepository.findOneOrFail({
        id: lecture_id,
      });
      return result;
    } catch {
      return null;
    }
  }

  /**
   *
   * @param {*} data
   * @returns
   */
  async createLecture(data) {
    try {
      const { content, ...body } = data;

      if (content) {
        body['content'] = content;
      }

      // multer로 s3에 파일 올리기
      // -> 에러 처리 필요
      const video_url = req.file.location;

      const { createdAt, updatedAt, ...result } =
        await this.#lecturRepository.save(
          lectureRepository.create({
            ...body,
            video_url,
            // date 관련 코드 수정 -> entity에서 자동으로 하게됨.
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        );
      return res.send({ ok: true, result });
    } catch {
      return null;
    }
  }

  /**
   *
   * @param {*} lecture_id
   * @param {*} data
   */
  async updateLectureById(lecture_id, data) {
    // multer관련 데이터 삭제와
    // order 구현 후 구현 예정
    // 미구현
  }

  /**
   *
   * @param {*} lecture_id
   * @returns
   */
  async deleteLectureById(lecture_id) {
    try {
      await this.#lecturRepository.delete({ id: lecture_id });

      // s3 데이터도 삭제 -> 미구현

      return { id: lecture_id };
    } catch {
      return null;
    }
  }
}
