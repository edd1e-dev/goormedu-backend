import { validateOrReject } from 'class-validator';
import env from '@/commons/config';
import { IService } from '@/commons/interfaces';
import { CookieOptions } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from './jwt.dto';

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
    return jwt.sign(payload, JwtService.privateKey);
  }
  verify(token: string) {
    return jwt.verify(token, JwtService.privateKey);
  }
}
