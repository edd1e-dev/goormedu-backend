import User from "../entity/user.entity";

export const findUser = async (req, res) => {
  try {
    const userRepository = await dataSource.getRepository(User);
    const user = await userRepository.findOneBy({
      id: req.params?.id,
    });
    return res.send({ user });
  } catch {
    return res.send({ user: null });
  }
};
