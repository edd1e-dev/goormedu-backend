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
    console.log(req.user?.role);
  }
  catch {}
}
