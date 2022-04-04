/**
 * 사용자 특정 Role 확인해서 차단하는 미들웨어
 *
 * @param {} req
 * @param {*} res
 * @param {*} next
 * @returns
 */

function verifyUserRole(...accssableRoleParam) {
  return async (req, res, next) => {
    const roleSet = new Set(accssableRoleParam);
    const accessableRole = [...roleSet];
    if (accessableRole.includes(req.user.role)) {
      next();
    } else {
      res.send({ ok: false, error: '해당 명령을 실행할 권한이 없습니다.' });
    }
  }
}

export default verifyUserRole;