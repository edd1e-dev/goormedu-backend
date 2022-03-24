import User from "../entity/user.entity";
import AppDataSource from "../db";

export const findUser = async (req, res) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({
      sub: req.params?.id ?? "",
    });
    return res.send({ user });
  } catch {
    return res.send({ user: null });
  }
};
