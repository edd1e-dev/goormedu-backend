import jwt from 'jsonwebtoken';
import User from '../users/user.entity';
import AppDataSource from '../db';

// eslint-disable-next-line import/prefer-default-export
export const login = async (req, res) => {
  const { sub, email, picture, displayName } = req.user;
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({
    sub,
    email,
  });

  if (!user) {
    const newUser = userRepository.create({
      email,
      username: displayName,
      sub,
      role: 'Student',
      thumbnail: picture,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await userRepository.save(newUser); // await
  }

  /*
  jwtPayload {
    id,
    role,
    iat
  }
  */
  const jwtPayload = { id: user.id, role: user.role };
  const token = jwt.sign(jwtPayload, process.env.JWT_PRIVATEKEY);
  return res.cookie('jwt', token, { httpOnly: true }).redirect('/'); // 나중에 https로 전환 시 수정 필요할 듯
};

export const logout = async (_, res) => {
  try {
    res.clearCookie('jwt').send;
  } catch {
    return res.send({ ok: false });
  }
  return res.send({ ok: true });
};

export const authStatusConfirm = async (req, res) => {
  try {
    const id = parseInt(req.user?.id ?? "0")
		const user = await AppDataSource.getRepository(User).findOneBy({ id });

    if (user) {
      const {sub, ...result } = user; 
      if (user.role === req.user?.role) {
        return res.send({ ok: true, result: { roleUpdate: false } }); 
      } else {
        const jwtPayload = { id: user.id, role: user.role };
        const token = jwt.sign(jwtPayload, process.env.JWT_PRIVATEKEY);
        res.cookie('jwt', token, { httpOnly: true });
        return res.send({ ok: true, result: { roleUpdate: true } }); 
      }
    } else {
      return res.send({ ok: false, error: "사용자 정보를 조회하지 못했습니다." });
    }
  } catch {
    return res.send({ ok: false, error: "예기치 못한 에러가 발생하였습니다." });
  }
}
