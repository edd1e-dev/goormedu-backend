import AppDataSource from '../db';
import Course from './course.entity';

export const findCourseById = async (req, res) => {
  try {
    const courseRepository = AppDataSource.getRepository(Course);
    const id = parseInt(req.params?.id ?? '0');
    const course = await courseRepository.findOneBy({
      id,
    });
    if (course) {
      const { createdAt, updatedAt, ...result } = course;
      res.send({ ok: true, result });
    } else {
      return res.send({ ok: false, error: '해당 코스를 조회하지 못했습니다.' });
    }
  } catch {
    return res.send({ ok: false, error: '예기치 못한 에러가 발생하였습니다.' });
  }
};

export const createCourse = async (req, res) => {
  try {
    const user = req.user;
    /* 
		미들웨어를 통해 차단됨
    if (user.role !== UserRole.Teacher && user.role !== UserRole.Admin) {
      return res.send({ ok: false, error: '코스 생성 권한이 없습니다.' });
    }
		*/
    const courseRepository = AppDataSource.getRepository(Course);

    const { cover_image, ...body } = req.body;
    /*
		req.file에서 cover를 s3에 저장하고 그 url을 저장할 것
		*/
    const s3_url = '';
    const { createdAt, updatedAt, ...result } = await courseRepository.save(
      courseRepository.create({
        ...body,
        teacher_id: user.id,
        cover_image: s3_url,
      })
    );
    return res.send({ ok: true, result });
  } catch {
    return res.send({ ok: false, error: '예기치 못한 에러가 발생하였습니다.' });
  }
};

export const updateCourseById = async (req, res) => {
  try {
    const user = req.user;
    /*
		미들웨어를 통해 차단
    if (user.role !== UserRole.Teacher && user.role !== UserRole.Admin) {
      return res.send({ ok: false, error: '코스 수정 권한이 없습니다.' });
    }
		*/
    const id = parseInt(req.params?.id ?? '0');
    const courseRepository = AppDataSource.getRepository(Course);
    const course = await courseRepository.findOneByOrFail({ id });
    const teacher_id = course.teacher_id;
    if (user.role === UserRole.Teacher && teacher_id !== user.id) {
      return res.send({
        ok: false,
        error: '코스 수정 권한이 없습니다.',
      });
    }
    for (const [key, val] of Object.entries(req.body)) {
      if (key === 'cover_image') {
        // s3에 저장하고 url 입력
      } else {
        course[key] = val;
      }
    }
    const { createdAt, updatedAt, ...result } = await courseRepository.save(
      course
    );
    return res.send({ ok: true, result });
  } catch {
    return res.send({ ok: false, error: '예기치 못한 에러가 발생하였습니다.' });
  }
};

export const deleteCourseById = async (req, res) => {
  try {
    const user = req.user;
    const id = parseInt(req.params?.id ?? '0');
    const courseRepository = AppDataSource.getRepository(Course);
    const course = await courseRepository.findOneByOrFail({ id });
    const teacher_id = course.teacher_id;
    if (user.role === UserRole.Teacher && teacher_id !== user.id) {
      return res.send({
        ok: false,
        error: '권한이 없습니다.',
      });
    }
    await courseRepository.delete({ id });
    return { ok: true, result: { id } };
  } catch {
    return res.send({ ok: false, error: '예기치 못한 에러가 발생하였습니다.' });
  }
};

export const findLearningCourses = async (req, res) => {
  try {
  } catch {}
};
export const findOfferingCourses = async (req, res) => {
  try {
  } catch {}
};
export const learnCourse = async (req, res) => {
  try {
  } catch {}
};
