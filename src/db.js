import { DataSource } from "typeorm";
import User from "./users/user.entity";
import Chapter from "./chapters/chapters.entity";
import Lecture from "./lecture/lecture.entity";
import Category from "./categories/categories.entity";
import Course from "./course/course.entity";
import Educator from "./educator/educator.entity";
import CompletionRecord from "./completionRecord/completionRecord.entity";

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true, // true 일 시 테이블 이미 존재한다고 뜰 수 있음. dropSchema: true 필요
  dropSchema: true, // true 일 시 Schema 매번 drop 시킴. 주의!!
  logging: true,
  entities: [User, Chapter, Lecture, Category, Course, Educator, CompletionRecord],
  subscribers: [],
  migrations: [],
});

export default AppDataSource;
