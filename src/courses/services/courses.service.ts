import {
  DeleteCourseDTO,
  FindAllCoursesDTO,
  FindCourseByIdDTO,
  FindCoursesByCategoryId,
  FindCoursesByIdsDTO,
  FindCoursesByQueryDTO,
  FindCoursesByTeacherIdDTO,
  UpdateCourseWithCoverImageDTO,
} from '@/courses/dtos/courses.dto';
import { CreateCourseDTO, UpdateCourseDTO } from '@/courses/dtos/courses.dto';
import { Repository, ILike, In } from 'typeorm';
import { CustomError, IService } from '@/commons/interfaces';
import Course from '@/courses/entities/course.entity';
import AppDataSource from '@/commons/db';
import { CONSOLE_LEVELS } from '@sentry/utils';

export default class CoursesService implements IService {
  private readonly courseRepository: Repository<Course>;

  constructor() {
    this.courseRepository = AppDataSource.getRepository(Course);
  }

  async findAllCourses({ select }: FindAllCoursesDTO): Promise<Course[]> {
    const result = await this.courseRepository.find({
      ...(select && { select }),
    });
    return result;
  }

  async findCoursesByQuery({
    query,
    select,
  }: FindCoursesByQueryDTO): Promise<Course[]> {
    const key = query.replace(/\"/gi, "").trim().replace(/ /gi, "%");
    if (key === '') 
      return [];
    console.log(key);
    const result = await this.courseRepository.find({
      where: [
        { title: ILike(`%${key}%`) },
        { description: ILike(`%${key}%`) }
      ],
      ...(select && { select }),
    });
    return result;
  }

  async findCoursesByCategoryId({
    category_id,
    select,
  }: FindCoursesByCategoryId): Promise<Course[]> {
    const result = await this.courseRepository.find({
      where: { category_id },
      ...(select && { select }),
    });
    return result;
  }

  async findCoursesByIds({
    ids,
    select,
  }: FindCoursesByIdsDTO): Promise<Course[]> {
    const result = await this.courseRepository.find({
      where: { id: In(ids) },
      ...(select && { select }),
    });
    return result;
  }

  async findCoursesByTeacherId({
    teacher_id,
    select,
  }: FindCoursesByTeacherIdDTO): Promise<Course[]> {
    const result = await this.courseRepository.find({
      where: { teacher_id },
      ...(select && { select }),
    });
    return result;
  }
  async findCourseById({ id, select }: FindCourseByIdDTO): Promise<Course> {
    const result = await this.courseRepository.findOne({
      where: { id },
      ...(select && { select }),
    });
    if (!result) {
      throw new CustomError('코스가 존재하지 않습니다.');
    }
    return result;
  }
  async createCourse({ teacher_id, data }: CreateCourseDTO): Promise<Course> {
    const result = await this.courseRepository.save(
      this.courseRepository.create({ ...data, teacher_id }),
    );
    return result;
  }
  async updateCourse({
    where,
    data: { ...rest },
  }: UpdateCourseDTO): Promise<Course> {
    const course = await this.courseRepository.findOne({ where });
    if (!course) {
      throw new CustomError('코스가 존재하지 않습니다.');
    }
    for (const [key, val] of Object.entries(rest)) course[key] = val;
    const result = await this.courseRepository.save(course);
    return result;
  }
  async updateCourseWithCoverImage({
    where,
    data: { cover_image, ...rest },
  }: UpdateCourseWithCoverImageDTO): Promise<Course> {
    const course = await this.courseRepository.findOne({ where });
    if (!course) {
      throw new CustomError('코스가 존재하지 않습니다.');
    }
    for (const [key, val] of Object.entries(rest)) course[key] = val;
    course.cover_image = cover_image;

    const result = await this.courseRepository.save(course);
    return result;
  }
  async deleteCourse(where: DeleteCourseDTO): Promise<DeleteCourseDTO> {
    const course = await this.courseRepository.findOne({ where });

    if (!course) {
      throw new CustomError('코스가 존재하지 않습니다.');
    }
    // s3 에서 course.cover_image 삭제 ??
    course.teacher_id = 0;
    await this.courseRepository.save(course);
    return where;
  }
}
