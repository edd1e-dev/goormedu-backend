import { validateOrReject } from 'class-validator';
import { BeforeUpdate } from 'typeorm';
import { CustomError } from './interfaces';

export default abstract class CoreEntity {
  @BeforeUpdate()
  async validate(): Promise<void> {
    try {
      await validateOrReject(this);
    } catch {
      throw new CustomError('DB에 잘못된 값이 입력되었습니다.');
    }
  }
}
