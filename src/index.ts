import env from './config';
import app from './app';
import AppDataSource from './db';

AppDataSource.initialize()
  .then(() =>
    app.listen(env.PORT, () => {
      console.log(`✅ Listening on: 'http://${env.DOMAIN}:${env.PORT}`);
    }),
  )
  .catch((e) => console.log(`❌ DB connection fail: ${e}`));
