import CoreEntity from '@/commons/core.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
} from 'typeorm';
import { IsNumber, IsDate } from 'class-validator';

@Entity()
@Unique(['student_id', 'lecture_id'])
export default class CompletionRecord extends CoreEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @IsNumber()
  @Column()
  student_id: number;

  @IsNumber()
  @Column()
  lecture_id: number;

  @IsNumber()
  @Column()
  course_id: number;

  @CreateDateColumn()
  @IsDate()
  created_at: Date;
}
