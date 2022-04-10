import { DataSource } from 'typeorm';
import env from './config';
import User from '@/users/user.entity';
import Category from '@/categories/category.entity';
import TeacherRecord from '@/teacher-records/teacher-record.entity';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: env.DB_HOST,
  port: +env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  synchronize: true, // true 일 시 테이블 이미 존재한다고 뜰 수 있음. dropSchema: true 필요
  dropSchema: false, // true 일 시 Schema 매번 drop 시킴. 주의!!
  logging: false,
  entities: [User, Category, TeacherRecord],
  subscribers: [],
  migrations: [],
});

export default AppDataSource;
