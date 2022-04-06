import Course from '../course/course.entity';
import AppDataSource from '../db';
import Lecture from './lecture.entity';
import CompletionRecord from '../completionRecord/completionRecord.entity';

// 일반적인 Lecture 정보
export const findLectureById = async (req, res) => {
  try {
    const lectureRepository = AppDataSource.getRepository(Lecture);
    const completionRepository = AppDataSource.getRepository(CompletionRecord);

    const id = parseInt(req.params?.id ?? '0');
    const user = req.user;

    const lecture = await lectureRepository.findOneByOrFail({
      id,
    });

    const {
      course_id,
      chapter_id,
      video_url,
      createdAt,
      updatedAt,
      content,
      ...result
    } = lecture;

    const completionData = await completionRepository.findOneBy({
      lecture_id: id,
      student_id: user.id,
    });

    const isCompleted = Boolean(completionData);
    result.isCompleted = isCompleted;

    res.send({ ok: true, result });
  } catch {
    return res.send({ ok: false, error: '예기치 못한 에러가 발생하였습니다.' });
  }
};

// 수강하는 lecture 들을 때 필요한 정보
export const findLectureDetail = async (req, res) => {
  try {
    const lectureRepository = AppDataSource.getRepository(Lecture);

    // learnApplication 코드 main에서 업데이트 되면
    // course 수강생인지 check -> 미작성

    const id = parseInt(req.params?.id ?? '0');
    const user = req.user;

    const lecture = await lectureRepository.findOneBy({
      id,
    });

    const { course_id, chapter_id, createdAt, updatedAt, ...result } = lecture;

    // content는 null이면 null 반환으로 구현됨 -> 맞는지

    // pre_lecture_id 없으면 반환 x
    // next_lecture_id 없으면 반환 x
    // -> 미구현?
    // 단순하게 해당 chapter_id를 가지는 lecture 들을
    // 검색해서 해당 lecture 들 끼리의 순서를 비교?

    res.send({ ok: true, result });
  } catch {
    return res.send({ ok: false, error: '예기치 못한 에러가 발생하였습니다.' });
  }
};

// lecture 1개 생성
export const createLecture = async (req, res) => {
  try {
    const user = req.user;

    const lectureRepository = AppDataSource.getRepository(Lecture);
    const { content, ...body } = req.body;

    if (content) {
      body['content'] = content;
    }

    const image = req.file.path;

    // 파일 올리기 -> 미구현
    const video_url = 's3://url';

    const { createdAt, updatedAt, ...result } = await lectureRepository.save(
      lectureRepository.create({
        ...body,
        video_url,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // lecture의 order값을 req.body 에 받는 걸로 일단 했는데,
      // order 값을 어떻게 계살 할지 -> 논의
    );
    return res.send({ ok: true, result });
  } catch {
    return res.send({ ok: false, error: '예기치 못한 에러가 발생하였습니다.' });
  }
};

// lecture 1개 정보 수정
// order 정보 수정은 어떻게???
export const updateLectureById = async (req, res) => {
  try {
    const user = req.user;
    const id = parseInt(req.params?.id ?? '0');

    const lectureRepository = AppDataSource.getRepository(Lecture);
    const courseRepository = AppDataSource.getRepository(Course);

    const lecture = await lectureRepository.findOneByOrFail({ id });
    const course = await courseRepository.findOneByOrFail({
      id: lecture.course_id,
    });

    // course id로 teacher id를 찾아온다
    const teacher_id = course.teacher_id;

    if (teacher_id !== user.id) {
      return res.send({
        ok: false,
        error: '권한이 없습니다.',
      });
    }
    // 미구현 ->
    // 바꿀 수 있는 것 :
    // chapter_id
    // title
    // video_url
    // content
    // order?
    // isPublic
    // updatedAt 수정시 다시 대입
  } catch {
    return res.send({ ok: false, error: '예기치 못한 에러가 발생하였습니다.' });
  }
};

// lecture 1개 삭제
export const deleteLectureById = async (req, res) => {
  try {
    const user = req.user;
    const id = parseInt(req.params?.id ?? '0');

    const lectureRepository = AppDataSource.getRepository(Lecture);
    const courseRepository = AppDataSource.getRepository(Course);

    const lecture = await lectureRepository.findOneByOrFail({ id });
    const course = await courseRepository.findOneByOrFail({
      id: lecture.course_id,
    });

    // course id로 teacher id를 찾아온다
    const teacher_id = course.teacher_id;

    if (teacher_id !== user.id) {
      return res.send({
        ok: false,
        error: '권한이 없습니다.',
      });
    }

    await lectureRepository.delete({ id });

    // lecture가 하나 삭제되면
    // 챕터 안의 lecture들의 order가 달라질 수도 있는데,
    // 이 lecture들의 order 변동 값들을 바꿔줘야 한다

    return res.send({ ok: true, result: { id } });
  } catch {
    return res.send({ ok: false, error: '예기치 못한 에러가 발생하였습니다.' });
  }
};
