import { DataSource } from "typeorm";
import User from "./entity/user.entity";
import Chapter from "./entity/chapter.entity";
import Lecture from "./entity/lecture.entity";
import Category from "./entity/category.entity";
import UserClassroom from "./entity/userClassroom.entity";

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true, // true 일 시 테이블 이미 존재한다고 뜰 수 있음. dropSchema: true 필요
  dropSchema: true, // true 일 시 Schema 매번 drop 시킴. 주의!!
  logging: false,
  entities: [User, Chapter, Lecture, Category, UserClassroom],
  subscribers: [],
  migrations: [],
});

export default AppDataSource;
