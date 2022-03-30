import "dotenv/config";
import app from "./app";
import AppDataSource from "./db";

AppDataSource.initialize()
  .then(() =>
    app.listen(process.env.PORT, () => {
      console.log(`✅ Listening on: 'http://localhost:${process.env.PORT}`);
    })
  )
  .catch((e ) => console.log(`❌ DB connection fail: ${e}`));
