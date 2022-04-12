import { JwtPayload } from './jwt.dto';
import { validateOrReject } from 'class-validator';
import env from '@/commons/config';
import { IService } from '@/commons/interfaces';
import { CookieOptions } from 'express';
import jwt from 'jsonwebtoken';

export default class JwtService implements IService {
  /**
    maxAge?: number | undefined;
    signed?: boolean | undefined;
    expires?: Date | undefined;
    httpOnly?: boolean | undefined;
    path?: string | undefined;
    domain?: string | undefined;
    secure?: boolean | undefined;
    encode?: ((val: string) => string) | undefined;
    sameSite?: boolean | 'lax' | 'strict' | 'none' | undefined;
   */
  public static readonly jwtCookieOptions: CookieOptions = { httpOnly: true };

  private static readonly privateKey: string = env.JWT_PRIVATEKEY;
  constructor() {}

  /**
   *
   * @param payload id, role 을 포함한 payload
   * 이 값은 jwt token에 포함될 정보이다.
   * @returns jwt token, string type
   */
  async sign(payload: JwtPayload): Promise<string> {
    await validateOrReject(new JwtPayload(payload), { whitelist: true });
    return jwt.sign({ ...payload }, JwtService.privateKey);
    // Error: Expected "payload" to be a plain object.
    // jwt.sign에 payload가 객쳉인줄 알았는데 아니라는 의미 => {...payload } 로 만들면 해결
    // 기존에 존재하는 사용자를 통해 payload를 만들면 에러가 발생했음 payload = user를 하면 plain object가 아닌가 봄
  }
  verify(token: string) {
    return jwt.verify(token, JwtService.privateKey);
  }
}
