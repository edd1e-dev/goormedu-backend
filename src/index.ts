import env from './commons/config';
import app from './commons/app';
import AppDataSource from './commons/db';

AppDataSource.initialize()
  .then(() =>
    app.listen(env.PORT, () => {
      console.log(`✅ Listening on: '${env.DOMAIN}:${env.PORT}`);
    }),
  )
  .catch((e) => console.log(`❌ DB connection fail: ${e}`));
