import 'dotenv/config';
import joi from 'joi';
import { IEnv } from './interfaces';

const envVarsSchema = joi
  .object<IEnv>()
  .keys({
    PORT: joi.number().default(4000),
    DOMAIN: joi.string().required(),
    CLIENT_DOMAIN: joi.string().required(),

    GOOGLE_CLIENT_ID: joi.string().required(),
    GOOGLE_SECRET: joi.string().required(),

    JWT_PRIVATEKEY: joi.string().required(),

    DB_HOST: joi.string().required(),
    DB_PORT: joi.string().required(),
    DB_USERNAME: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_DATABASE: joi.string().required(),

    AWS_REGION: joi.string().required(),
    AWS_S3: joi.string().required(),
    AWS_CLIENT_ID: joi.string().required(),
    AWS_SECRET: joi.string().required(),
  })
  .unknown();

const { value, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

function env(
  value: IEnv | undefined,
  error: joi.ValidationError | undefined,
): IEnv {
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  } else if (value === undefined) {
    throw Error('env is not found, please check src/config.ts');
  } else {
    return value;
  }
}
export default env(value, error);
