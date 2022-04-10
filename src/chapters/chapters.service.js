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
   * @param {*} courseId 코스 번호
   * @returns 성공 시 Course Entity 실패 시 null
   */
  async findCourseByCourseId(courseId) {
    try {
      const id = courseId;
      const courseData = await this.#courseRepository.findOneBy({ id });

      if (courseData) {
        return courseData;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  /**
   * @param {*} select Category 조회 결과 형식
   * @returns 성공 시 Chapters Entity 실패 시 null
   */
  async findChaptersByCourseId(where, select) {
    try {
      const chapterData = await this.#chapterRepository.find({
        where: { course_id: where },
        select,
      });
      if (chapterData) {
        for (const [_, chapter] of Object.entries(chapterData)) {
          chapter.lectures = [];
        }
      }
      return chapterData;
    } catch (error) {
      console.log(error);
      return null;
    }
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
