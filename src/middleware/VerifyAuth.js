import User from '../users/user.entity';
import AppDataSource from '../db';

/**
 * 로그인된 사용자인지 검증
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const verifyAuthById = async (req, res, next) => {
  try {
    if (req.user) {
      const userId = parseInt(req.user?.id ?? '0');
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ id: userId });
      if (!user) {
        return res.send({ ok: false, error: '사용자 검증에 실패하였습니다.' });
      }
      next();
    } else {
      return res.send({ ok: false, error: '사용자 검증에 실패하였습니다.' });
    }
  } catch {
    return res.send({ ok: false, error: '예기치 못한 에러가 발생하였습니다.' });
  }
};

export default verifyAuthById;
