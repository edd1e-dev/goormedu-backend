import env from './commons/config';
import app from './commons/app';
import AppDataSource from './commons/db';

process.on('SIGINT', () => {
  // app.close();
  process.exit(0);
});

AppDataSource.initialize()
  .then(() => {
      app.listen(env.PORT, () => {
        (<any> process).send('ready');
        console.log(`✅ Listening on: '${env.DOMAIN}:${env.PORT}`);
      })
    }
  )
  .catch((e) => console.log(`❌ DB connection fail: ${e}`));