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

/**
 * 어떠한 값을 기준으로 비교 후 해당 사용자의 정보를 삭제
 * 
 * @param {*} req 
 * @param {*} res 
 */
export const deleteUser = async (req, res) => {
  // 테스트 완료
  // 여기서 삭제하려는 토큰이 본인 토큰이 맞는지 검증 필요
  try {
    await AppDataSource
      .createQueryBuilder()
      .delete()
      .from(User)
      .where("id = :id", { id: req.params?.id })
      .execute();
    res.status(200).send({ message: 'Success' });
  } catch (error) {
    res.status(409).send({ message: `Fail ${error}` });
  }
}

/**
 * 어떠한 값을 기준으로 비교 후 해당 사용자의 권한을 변경
 * 기본적으로 Student이며 Body 값의 role이 지정되어 있을 경우에만 해당 권한으로 변경
 * /users/:id/role/update
 * @param {*} req 
 * @param {*} res 
 */
export const changeUserRole = async (req, res) => {
  console.log(req.body)
  /*
  try {
    await AppDataSource
      .createQueryBuilder()
      .update(User)
      .set({ firstName: "Timber", lastName: "Saw" })
      .where("id = :id", { id: 1 })
      .execute();
    res.status(200).send({ message: 'Success' });
  } catch (error) {
    res.status(409).send({ message: `Fail ${error}` });
  }
  */
}