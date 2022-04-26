import env from './commons/config';
import app from './commons/app';
import AppDataSource from './commons/db';

let isDisableKeepAlive = false;

/*
app.use((_, res, next) => {
  if (isDisableKeepAlive) {
    res.set("Connection", "close");
  }
  next();
})
*/

AppDataSource.initialize()
  .then(() => {
      app.listen(env.PORT, () => {
        // (<any> process).send("ready");
        console.log(`✅ Listening on: '${env.DOMAIN}:${env.PORT}`);
      })
    }
  )
  .catch((e) => console.log(`❌ DB connection fail: ${e}`));

/*
process.on("SIGINT", () => {
  isDisableKeepAlive = true;
  app.on("exit", () => {
    console.log("Server closed");
    process.exit(0);
  })
});
*/