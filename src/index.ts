import env from './commons/config';
import app from './commons/app';
import AppDataSource from './commons/db';
import { createHttpTerminator } from 'http-terminator';

let server;
let httpTerminator;

process.on('SIGINT', () => {
  if (server && createHttpTerminator)
  {
    setTimeout(() => {
      httpTerminator.terminate()
    }, 1000)
  }
  setTimeout(() => {
    process.exit(0);
  }, 1000)
});

AppDataSource.initialize()
  .then(() => {
      server = app.listen(env.PORT, () => {
        // (<any> process).send('ready');
        console.log(`✅ Listening on: '${env.DOMAIN}:${env.PORT}`);
      })
      httpTerminator = createHttpTerminator({ server });
    }
  )
  .catch((e) => console.log(`❌ DB connection fail: ${e}`));