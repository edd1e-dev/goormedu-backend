import AppDataSource from '../db';
import LearnApplication from './learn-application.entity';

const getLearnApplicationRepository = () =>
  AppDataSource.getRepository(LearnApplication);

export const findLearnApplication = async ({ student_id, course_id }) => {
  try {
    const learnApplicationRepository = getLearnApplicationRepository();
    const learnApplication = await learnApplicationRepository.findOneBy({
      student_id,
      course_id,
    });
    if (learnApplication) {
      const { createdAt, updatedAt, ...data } = learnApplication;
      const count_learning = 0;
      return { ok: true, result: { ...data, count_learning } };
    } else {
      return { ok: false, error: '수강 기록을 조회하지 못했습니다.' };
    }
  } catch {
    return { ok: false, error: '예기치 못한 에러가 발생했습니다.' };
  }
};
export const createLearnApplication = async ({ student_id, course_id }) => {
  try {
    const learnApplicationRepository = getLearnApplicationRepository();
    const { createdAt, updatedAt, ...result } =
      await learnApplicationRepository.save(
        learnApplicationRepository.create({ student_id, course_id })
      );
  } catch {}
};
export const updateLearnApplication = ({
  criteria: { student_id, course_id },
  data: { last_learning_date, last_lecture_id, next_lecture_id },
}) => {
  try {
    const learnApplicationRepository = getLearnApplicationRepository();
  } catch {}
};
export const deleteLearnApplication = ({ student_id, course_id }) => {
  try {
    const learnApplicationRepository = getLearnApplicationRepository();
  } catch {}
};
