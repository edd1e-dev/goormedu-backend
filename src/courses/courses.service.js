import AppDataSource from '../db';
import Course from './course.entity';

export default class CoursesService {
  #courseRepository;
  constructor() {
    this.#courseRepository = AppDataSource.getRepository(Course);
  }

  async findCourseById({ course_id }) {
    try {
      const result = await this.#courseRepository.findOneByOrFail({
        id,
      });
      return result;
    } catch {
      return null;
    }
  }

  /**
   *  data를 통해 새로운 course생성
   * @param data title, description, level, teacher_id, category_id, cover_image
   * @returns 성공시 coruse, 실패시 null
   */
  async createCourse(data) {
    try {
      const {
        title,
        description,
        level,
        teacher_id,
        category_id,
        cover_image,
      } = data;
      const result = await this.#courseRepository.save(
        this.#courseRepository.create({
          title,
          description,
          level,
          teacher_id,
          category_id,
          cover_image,
        })
      );
      return result;
    } catch {
      return null;
    }
  }

  /**
   * data에는 cover_image가 빠질 수 있으며 이 경우, cover_image는 변경하지 않습니다.
   * 다른 값들은 모두 있어야 합니다. 하지만 논리상 문제가 발생하진 않습니다.
   * @param  id 변경할 course id
   * @param  data 변결할 데이터를 담은 객체
   * @returns 성공시 corse, 실패시, null
   */
  async updateCourseById(id, data) {
    try {
      const course = await this.#courseRepository.findOneByOrFail({
        id,
      });
      for (const [key, val] of Object.entries(data)) course[key] = val;
      const result = await this.#courseRepository.save(course);
      return result;
    } catch {
      return null;
    }
  }

  /**
   *
   * @param id delete할 course의 id
   * @returns 성공시 id를 담은 객체, 실패시 null
   */
  async deleteCourseById(id) {
    try {
      await this.#courseRepository.delete({ id });
      return { id };
    } catch {
      return null;
    }
  }
}
