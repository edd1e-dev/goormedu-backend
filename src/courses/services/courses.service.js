import { ILike, In } from 'typeorm';
import AppDataSource from '../../db';
import Course from '../entities/course.entity';

export default class CoursesService {
  #courseRepository;
  constructor() {
    this.#courseRepository = AppDataSource.getRepository(Course);
  }

  /**
   *
   * @param  id 해당 id를 가진 코스 조회
   * @param  select 조회결과에 포합시킬 요소, nullable
   * @returns 성공시 course, 실패시 null
   */
  async findCourseById({ id, select }) {
    try {
      const result = await this.#courseRepository.findOneOrFail({
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
   * @param  ids course_id의 배열,해당하는 코스 정보를 불러옴
   * @param  select 조회 결과에 포함시킬 요소, nullable
   * @returns 성공시 course, 실패시 null
   */
  async findCoursesByIds({ ids, select }) {
    try {
      const result = await this.#courseRepository.find({
        where: { id: In(ids) },
        ...(select && { select }),
      });
      return result;
    } catch {
      return null;
    }
  }

  /**
   * 담당 코스 목록 조회
   * @param teacher_id 해당 값을 기준으로 조회
   * @param select 조회 결과에 포함시킬 요소, nullable
   * @returns 성공시 course, 실패시 null
   */
  async findCoursesByTeacherId({ teacher_id, select }) {
    try {
      const result = await this.#courseRepository.find({
        where: { teacher_id },
        ...(select && { select }),
      });
      return result;
    } catch {
      return null;
    }
  }
  /**
   * 전체 코스 조회
   * @param  select 조회결과에 포합시킬 요소, nullable
   * @returns 성공시 course, 실패시 null
   */
  async findAllCourses({ select }) {
    try {
      const result = await this.#courseRepository.find({
        ...(select && { select }),
      });
      return result;
    } catch {
      return null;
    }
  }

  /**
   * 코스 검색, 현재는 강의 명에 대해서만 작동
   * @param query 가 교육자 이름이거나 코스명인 코스들 조회
   * @param  select 조회결과에 포합시킬 요소, nullable
   * @returns 성공시 course, 실패시 null
   */
  async searchCourses({ query, select }) {
    try {
      const key = query.trim().replace(/ +/g, ' ');
      if (key === '') {
        return [];
      }
      const result = this.#courseRepository.find({
        where: { title: ILike(`%${key} #%`) },
        ...(select && { select }),
      });
      return result;
    } catch {
      return null;
    }
  }

  async findCoursesByCategoryId({ category_id, select }) {
    try {
      const result = await this.#courseRepository.find({
        where: { category_id },
        ...(select && { select }),
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
   * id, teacher_id에 해당하는 course를 data로 업데이트
   * @param  where id, teacher_id를 포함, 해당 조건으로 대상 지정
   * @param  data 변결할 데이터를 담은 객체, 빠진 데이터는 변경안함
   * @returns 성공시 corse, 실패시, null
   */
  async updateCourse({
    where: { id, teacher_id },
    data: { cover_image, ...rest },
  }) {
    try {
      const course = await this.#courseRepository.findOneOrFail({
        where: { id, teacher_id },
      });
      for (const [key, val] of Object.entries(rest)) course[key] = val;
      if (cover_image) {
        // s3에서 기존의 이미지를 제거 요청
        course.cover_image = cover_image;
      }
      const result = await this.#courseRepository.save(course);
      return result;
    } catch {
      return null;
    }
  }

  /**
   *
   * @param id course id
   * @param teacher_id
   * @returns 성공시 id를 담은 객체, 실패시 null
   */
  async deleteCourse({ id, teacher_id }) {
    try {
      const { cover_image } = await this.#courseRepository.findOneOrFail({
        where: { id, teacher_id },
      });
      if (cover_image) {
        // s3에서 데이터 삭제 요청
      }
      await this.#courseRepository.delete({ id, teacher_id });
      return { id };
    } catch {
      return null;
    }
  }
}
