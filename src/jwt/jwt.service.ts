import env from '@/config';
import { jwtPayload } from '@/interfaces/jwt';
import jwt from 'jsonwebtoken';

export default class JwtService implements IService {
  private static readonly privateKey: string = env.JWT_PRIVATEKEY;
  constructor() {}

  /**
   *
   * @param payload id, role 을 포함한 payload
   * 이 값은 jwt token에 포함될 정보이다.
   * @returns jwt token, string type
   */
  sign(payload: jwtPayload): string {
    return jwt.sign(payload, JwtService.privateKey);
  }
  verify() {}
}
