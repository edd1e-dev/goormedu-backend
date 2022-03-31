import User from "./user.entity";
import AppDataSource from "../db";
import { SimpleConsoleLogger } from "typeorm";


/**
 * JWT sub 값을 기준으로 비교 후 해당 사용자의 정보를 조회
 * 
 * /users/:id
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const findUser = async (req, res) => {
  let responseData = {};

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({
      sub: req.user.sub ?? "",
    });

    if (user === null || isEmptyObj(user)) {
      responseData.ok = false;
      responseData.error = '요청에 실패하였습니다. 사유: 로그인된 사용자만 접근할 수 있습니다.';
    } else {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({
        id: req.params?.id ?? "",
      });

      if (user === null || isEmptyObj(user)) {
        responseData.ok = false;
        responseData.error = '요청에 실패하였습니다. 사유: 해당하는 레코드를 찾을 수 없습니다.';
      } else {
        const {sub, ...userPublicData} = user;
        responseData = { 
          ok: true,
          result: userPublicData
        };
      }
    }
  } catch (error) {
    responseData.ok = false;
    responseData.error = `요청에 실패하였습니다. 사유: ${error.message}`;
  } finally {
    return res.status(200).send(responseData);
  }
};

/**
 * JWT sub 값을 기준으로 비교 후 사용자 본인의 정보를 조회
 * 
 * /users/profile
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */

 export const getUserProfile = async (req, res) => {
  let responseData = {};

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({
      sub: req.user.sub ?? "",
    });

    if (user === null || isEmptyObj(user)) {
      responseData.ok = false;
      responseData.error = '요청에 실패하였습니다. 사유: 해당하는 레코드를 찾을 수 없습니다.';
    } else {
      const {sub, ...userPublicData} = user;
      responseData = { 
        ok: true,
        result: userPublicData
      };
    }
  } catch (error) {
    responseData.ok = false;
    responseData.error = `요청에 실패하였습니다. 사유: ${error.message}`;
  } finally {
    return res.status(200).send(responseData);
  }
};

/**
 * JWT sub 값을 기준으로 비교 후 해당 사용자의 정보를 삭제
 * 관리자인 경우 모든 삭제 가능
 * 일반 사용자인 경우 본인 계정만 삭제 가능
 * 
 * /users/:id/delete
 * @param {*} req 
 * @param {*} res 
 */
export const deleteUser = async (req, res) => {
  let responseData = {};

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({
      sub: req.user.sub ?? "",
    });

    if (user === null || isEmptyObj(user)) {
      responseData.ok = false;
      responseData.error = '요청에 실패하였습니다. 사유: 로그인된 사용자만 접근할 수 있습니다.';
    } else {
      // 관리자인 경우
      if (user.role === "Admin") {
        let transaction = await AppDataSource
        .createQueryBuilder()
        .delete()
        .from(User)
        .where("id = :id", { id: req.params?.id })
        .execute()

        if (transaction.affected == 0) {
          responseData.ok = false;
          responseData.error = '요청에 실패하였습니다. 사유: 해당하는 레코드를 찾을 수 없습니다.';
        } else {
          responseData.ok = true;
          responseData.results = { 
            id: req.params?.id
          };
        }
      // 관리자가 아닌 경우
      } else {
        console.log(user.id)
        console.log(req.params?.id)
        if (user.id == req.params?.id)
        {
          let transaction = await AppDataSource
          .createQueryBuilder()
          .delete()
          .from(User)
          .where("id = :id", { id: user.id })
          .execute()

          if (transaction.affected == 0) {
            responseData.ok = false;
            responseData.error = '요청에 실패하였습니다. 사유: 해당하는 레코드를 찾을 수 없습니다.';
          } else {
            responseData.ok = true;
            responseData.results = { 
              id: req.params?.id
            };
          }
        } else {
          responseData.ok = false;
          responseData.error = '요청에 실패하였습니다. 사유: 사용자 본인만 삭제할 수 있습니다.';
        }
      }
    }
  } catch (error) {
    console.log(`error: ${error}`);
    responseData.ok = false;
    responseData.error = `요청에 실패하였습니다. 사유: ${error.message}`;
  } finally {
    return res.status(200).send(responseData);
  }
}

/**
 * JWT sub 값을 기준으로 비교 후 해당 사용자의 권한을 변경
 * 기본적으로 Student이며 Body 값의 role이 지정되어 있을 경우에만 해당 권한으로 변경
 * 관리자만 실행 가능
 * Student | Teacher | Admin
 * 
 * /users/:id/role/update
 * @param {*} req 
 * @param {*} res 
 */
export const updateUserRole = async (req, res) => {
  let roleType = "";
  let responseData = {};
  
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({
      sub: req.user.sub ?? "",
    });

    if (user === null || isEmptyObj(user)) {
      responseData.ok = false;
      responseData.error = '요청에 실패하였습니다. 사유: 로그인된 사용자만 접근할 수 있습니다.';
    } else {
      // 관리자인 경우
      if (user.role === "Admin") {
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

        let transaction = await AppDataSource
          .createQueryBuilder()
          .update(User)
          .set({ role: roleType })
          .where("id = :id", { id: req.params?.id })
          .execute();

        if (transaction.affected == 0) {
          responseData.ok = false;
          responseData.error = '요청에 실패하였습니다. 사유: 해당하는 레코드를 찾을 수 없습니다.';
        } else {
          responseData.ok = true;
          responseData.results = { 
            id: req.params?.id,
            role: roleType
          };
        }
      }
    }
  } catch (error) {
    responseData.ok = false;
    responseData.error = `요청에 실패하였습니다. 사유: ${error.message}`;
  } finally {
    return res.status(200).send(responseData);
  }
}

function isEmptyObj(obj) {
  if(obj.constructor === Object 
    && Object.keys(obj).length === 0)  {
    return true;
  }
  
  return false;
}