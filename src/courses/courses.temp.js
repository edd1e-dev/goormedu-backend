// 외부 api 임시 정의

const jwtMiddleware = () => {};

const role = (...arg) => {};
/**
 * req.body, req.file등을 보고 s3과정을 거쳐 알맞는 data를 반환, multer관련
 */
const getData = async ({ body, file }) => {};

/**
 * CompleteRecord Service
 */
const countCompleteRecord = async ({ student_id, course_id }) => 0;
