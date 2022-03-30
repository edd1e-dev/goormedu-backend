import User from "./user.entity";
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

export const getUserSelfInfo = async (req, res) => {
  // passport google sub 데이터랑 비교하여 그 row만 가져오기
  try {
    return "Self";
  } catch {
    return res.send({ error: "404,Unauthorized" });
  }
};

export const deleteUser = async (req, res) => {
  console.log(req.params?.id);

  await AppDataSource
    .createQueryBuilder()
    .delete()
    .from(User)
    .where("id = :id", { id: req.params?.id })
    .execute();
}