import 'dotenv/config';
import joi from 'joi';

const envVarsSchema = joi
  .object()
  .keys({
    PORT: joi.number().default(4000),
    DOMAIN: joi.string().required(),

    GOOGLE_CLIENT_ID: joi.string().required(),
    GOOGLE_SECRET: joi.string().required(),

    JWT_PRIVATEKEY: joi.string().required(),

    DB_HOST: joi.string().required(),
    DB_PORT: joi.string().required(),
    DB_USERNAME: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_DATABASE: joi.string().required(),
  })
  .unknown();

const { value: env, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}
export default env;
