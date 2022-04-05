import AppDataSource from '../db';
import LearnApplication from './learn-application.entity';

const getLearnApplicationRepository = () =>
  AppDataSource.getRepository(LearnApplication);

/**
 * completion record's service
 */
const countlearning = ({ student_id, course_id }) => 0;

/**
 * @param where LearnApplication 조회 기준
 * where은 student_id:number, course_id:number를 property로 갖음
 * @returns 성공시 LearnApplication, 실패시 null
 */
export const findLearnApplication = async (where) => {
  try {
    const { student_id, course_id } = where; // validation
    const learnApplicationRepository = getLearnApplicationRepository();
    const result = await learnApplicationRepository.findOneByOrFail({
      student_id,
      course_id,
    });
    return result;
  } catch {}
  return null;
};

/**
 * select course_id from LearnApplication where criteria
 * @param criteria 조회 기준이 될 값이 들어감, {course_id:number}|{student_id:number}
 * @returns number[]
 */
export const findCourseIds = async (criteria) => {
  try {
    const learnApplicationRepository = getLearnApplicationRepository();
    const result = await learnApplicationRepository.find({
      where: {
        ...(criteria.student_id && { student_id: criteria.student_id }),
        ...(criteria.course_id && { course_id: criteria.course_id }),
      },
      select: { course_id },
    });
    return result.flat();
  } catch {
    return null;
  }
};

/**
 * @param data LearnApplication 생성 기준, student_id, course_id
 * @returns 성공시 LearnApplication, 실패시 null
 */
export const createLearnApplication = async (data) => {
  try {
    const { student_id, course_id } = data; // validation
    const learnApplicationRepository = getLearnApplicationRepository();
    const { createdAt, updatedAt, ...result } =
      await learnApplicationRepository.save(
        learnApplicationRepository.create({ student_id, course_id })
      );
    return result;
  } catch {}
  return null;
};

/**
 * @param where LearnApplication 조회 기준
 * @param data 변경할 데이터
 * @returns 성공시 LearnApplication 단, count_learning제외, 실패시 null
 */
export const updateLearnApplication = async ({
  where: { student_id, course_id },
  data, // : { last_learning_date, last_lecture_id, next_lecture_id },
}) => {
  try {
    const learnApplicationRepository = getLearnApplicationRepository();
    const learnApplication = await learnApplicationRepository.findOneByOrFail({
      student_id,
      course_id,
    });
    for (const [key, val] of Object.entries(data)) {
      learnApplication[key] = val;
    }
    const { createdAt, updatedAt, ...result } =
      await learnApplicationRepository.save(learnApplication);
    return result;
  } catch {}
  return null;
};

/**
 * @param where LearnApplication 조회 기준
 * @returns 성공시 where, 실패시 null
 */
export const deleteLearnApplication = async (where) => {
  try {
    const { student_id, course_id } = data; // validation
    const learnApplicationRepository = getLearnApplicationRepository();
    await learnApplicationRepository.delete({ student_id, course_id });
    return where;
  } catch {}
  return null;
};
