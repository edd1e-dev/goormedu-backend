import User from "./user.entity";
import AppDataSource from "../db";
import { SimpleConsoleLogger } from "typeorm";
import { UserRole } from "./UserRole";

/**
 * 사용자 특정 Role 확인해서 차단하는 미들웨어
 * 
 * @param {} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
 export function verifyUserRole(accessableRole) {
  return async (req, res, next) => {
    if(accessableRole.has(req.user.role)) {
      next();
    } else {
      res.send({ ok: false, error: '해당 명령을 실행할 권한이 없습니다.' })
    }
  }
}

/**
 * 로그인된 사용자인지 검증
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const verifyAuthById = async (req, res, next) => {
  try {
    if (req.user) {
      const userId = parseInt(req.user?.id ?? "0");
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ id: userId });
      next();
    } else {
      res.send({ ok: false, error: '사용자 검증에 실패하였습니다.' })
    }
  } catch {
    return res.send({ ok: false, error: "예기치 못한 에러가 발생하였습니다." });
  } 
}

/**
 * 해당 사용자의 정보를 조회
 * 
 * /users/:id
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const findUserById = async (req, res) => {
  try {
    const id = parseInt(req.params?.id ?? "0")
		const user = await AppDataSource.getRepository(User).findOneBy({ id });

    if (user) {
      const {sub, ...result } = user; 
      return res.send({ ok: true, result }); 
    } else {
      return res.send({ ok:false, error: "사용자 정보를 조회하지 못했습니다." });
    }
  } catch {
    return res.send({ ok: false, error: "예기치 못한 에러가 발생하였습니다." });
  }
};

/**
 * 사용자 본인의 정보를 조회
 * 
 * /users/profile
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const getSelfUserProfile = async (req, res, next) => {
  try {
    const id = parseInt(req.user?.id ?? "0")
		const user = await AppDataSource.getRepository(User).findOneBy({ id });

    if (user) {
      const {sub, ...result } = user; 
      return res.send({ ok: true, result }); 
    } else {
      return res.send({ ok:false, error: "사용자 정보를 조회하지 못했습니다." });
    }
  } catch {
    return res.send({ ok: false, error: "예기치 못한 에러가 발생하였습니다." });
  }
}

/**
 * 해당 사용자의 정보를 삭제
 * 관리자인 경우 모든 삭제 가능
 * 일반 사용자인 경우 본인 계정만 삭제 가능
 * 
 * /users/:id/delete
 * @param {*} req 
 * @param {*} res 
 */
 export const deleteUserById = async (req, res) => {
  try {
		const ownProfile = req.user; // { sub, role }
		const id = parseInt(req.params?.id ?? "0");
		if (ownProfile.role !== UserRole.Admin && ownProfile.id !== id) { 
			return res.send({ ok: false, error: "해당 명령을 실행할 권한이 없습니다." });
		}
		await AppDataSource.getRepository(User).delete({ id }); 
		return res.send({ ok: true, result: { id }});
  } catch (e) {
		return res.send({ ok: false, error: "예기치 못한 에러가 발생하였습니다." + e});
	}
}

/**
 * 해당 사용자의 권한을 변경
 * 기본적으로 Student이며 Body 값의 role이 지정되어 있을 경우에만 해당 권한으로 변경
 * 관리자만 실행 가능
 * Student | Teacher | Admin
 * 
 * /users/:id/role/update
 * @param {*} req 
 * @param {*} res 
 */
 export const updateUserRole = async (req, res) => {
  try {
		const newRole = req.body.role;
		if (newRole !== UserRole.Student
       && newRole !== UserRole.Teacher
       && newRole !== UserRole.Admin) {
      return res.send({ ok: false, error: "존재하지 않는 권한입니다." });
		}
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({
      id: req.user.id,
    });
		if (user) {
			user.role = newRole;
			const { sub, ...result } = await userRepository.save(user);
			return res.send({ ok: true, result });
		} else {
			return res.send({ ok:false, error: "해당 사용자를 조회하지 못했습니다." });
		}
  } catch {
		return res.send({ ok: false, error: "예기치 못한 에러가 발생했습니다." });
  }
}