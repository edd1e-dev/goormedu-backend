import { DataSource } from "typeorm";
import User from "./users/user.entity";
import Chapter from "./chapter/chapter.entity";
import Lecture from "./lecture/lecture.entity";
import Category from "./category/category.entity";
import UserClassroom from "./userClassroom/userClassroom.entity";
import Course from "./course/course.entity";

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false, // true 일 시 테이블 이미 존재한다고 뜰 수 있음. dropSchema: true 필요
  dropSchema: false, // true 일 시 Schema 매번 drop 시킴. 주의!!
  logging: false,
  entities: [User, Chapter, Lecture, Category, UserClassroom, Course],
  subscribers: [],
  migrations: [],
});

export default AppDataSource;
