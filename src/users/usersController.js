import User from "./user.entity";
import AppDataSource from "../db";
import { SimpleConsoleLogger } from "typeorm";

/**
 * JWT 값을 기준으로 비교 후 해당 사용자의 정보를 조회
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const findUser = async (req, res) => {
  let result = {};

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({
      id: req.params?.id ?? "",
    });
    if (user === null || isEmptyObj(user)) {
      result.ok = false;
      result.error = '요청에 실패하였습니다. 사유: 해당하는 레코드를 찾을 수 없습니다.';
    } else {
      const {sub, ...userPublicData} = user;
      return res.send({ userPublicData });
    }
  } catch (error) {
    result.ok = false;
    result.error = `요청에 실패하였습니다. 사유: ${error}`;
  } finally {
    return res.status(200).send(result);
  }
};

/**
 * JWT 값을 기준으로 비교 후 사용자 본인의 정보를 조회
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const getUserSelfInfo = async (req, res) => {
  // passport google sub 데이터랑 비교하여 그 row만 가져오기
  let result = {};

  try {
    let transaction = await AppDataSource
      .createQueryBuilder()
      .delete()
      .from(User)
      .where("id = :id", { id: 4 /* req.params?.id */ })
      .execute()
    
    if (transaction.affected == 0) {
      result.ok = false;
      result.error = '요청에 실패하였습니다. 사유: 해당하는 레코드를 찾을 수 없습니다.';
    } else {
      result.ok = true;
      result.results = { 
        id: req.params?.id
      };
    }
  } catch (error) {
    console.log(`error: ${error}`);
    result.ok = false;
    result.error = `요청에 실패하였습니다. 사유: ${error}`;
  } finally {
    return res.status(200).send(result);
  }
};

/**
 * JWT 값을 기준으로 비교 후 해당 사용자의 정보를 삭제
 * @param {*} req 
 * @param {*} res 
 */
export const deleteUser = async (req, res) => {
  // 여기서 삭제하려는 토큰이 본인 토큰이 맞는지 검증 필요
  let result = {};

  try {
    let transaction = await AppDataSource
      .createQueryBuilder()
      .delete()
      .from(User)
      .where("id = :id", { id: req.params?.id })
      .execute()
    
    if (transaction.affected == 0) {
      result.ok = false;
      result.error = '요청에 실패하였습니다. 사유: 해당하는 레코드를 찾을 수 없습니다.';
    } else {
      result.ok = true;
      result.results = { 
        id: req.params?.id
      };
    }
  } catch (error) {
    console.log(`error: ${error}`);
    result.ok = false;
    result.error = `요청에 실패하였습니다. 사유: ${error}`;
  } finally {
    return res.status(200).send(result);
  }
}

/**
 * JWT 값을 기준으로 비교 후 해당 사용자의 권한을 변경
 * 기본적으로 Student이며 Body 값의 role이 지정되어 있을 경우에만 해당 권한으로 변경
 * Student | Teacher | Admin
 * /users/:id/role/update
 * @param {*} req 
 * @param {*} res 
 */
export const updateUserRole = async (req, res) => {
  let roleType = "";
  let result = {};

  if (isEmptyObj(req.body) == true || req.body.role === undefined) {
    roleType = "Teacher";
  } else {
    if (req.body.role === "Student" 
      || req.body.role === "Teacher"
      || req.body.role === "Admin") {
        roleType = req.body.role;
    } else {
      roleType = "Student";
    }
  }
  
  try {
    let transaction = await AppDataSource
      .createQueryBuilder()
      .update(User)
      .set({ role: roleType })
      .where("id = :id", { id: req.params?.id })
      .execute();

    if (transaction.affected == 0) {
      result.ok = false;
      result.error = '요청에 실패하였습니다. 사유: 해당하는 레코드를 찾을 수 없습니다.';
    } else {
      result.ok = true;
      result.results = { 
        id: req.params?.id,
        role: roleType
      };
    }
  } catch (error) {
    console.log(`error: ${error}`);
    result.ok = false;
    result.error = `요청에 실패하였습니다. 사유: ${error}`;
  } finally {
    return res.status(200).send(result);
  }
}

function isEmptyObj(obj)  {
  if(obj.constructor === Object 
    && Object.keys(obj).length === 0)  {
    return true;
  }
  
  return false;
}