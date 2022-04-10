import Chapter from './chapters.entity';
import AppDataSource from '../commons/db';
import Course from '../course/course.entity';

export default class ChaptersService {
  #courseRepository;
  #chapterRepository;

  constructor() {
    this.#courseRepository = AppDataSource.getRepository(Course);
    this.#chapterRepository = AppDataSource.getRepository(Chapter);
  }

  /**
   * @param chapterData Chapter Entity
   * @param where 코스 번호
   * @returns 성공 시 Chapter Entity + Lecture Entity 실패 시 null
   */
  async findLecturesByCourseId(chapterData, where) {
    try {
      const lectureData = await this.#chapterRepository
        .query(`SELECT lecture.chapter_id, lecture.id, lecture.title, lecture.order, completion_record.lecture_id FROM lecture \
                LEFT JOIN completion_record ON lecture.id = completion_record.lecture_id \
                WHERE lecture.course_id = ${where}`);

      if (lectureData) {
        for (const [_, lecture] of Object.entries(lectureData)) {
          if (lecture.lecture_id) {
            lecture.isCompleted = true;
          } else {
            lecture.isCompleted = false;
          }
          delete lecture.lecture_id;
          for (const [_, chapter] of Object.entries(chapterData)) {
            if (lecture.chapter_id === chapter.id) {
              delete lecture.chapter_id;
              chapter.lectures.push(lecture);
            }
          }
        }
        return chapterData;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
