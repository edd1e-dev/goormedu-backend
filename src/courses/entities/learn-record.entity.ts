import CoreEntity from '@/commons/core.entity';
import { IsNumber, IsDate, IsOptional } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['student_id', 'course_id'])
export default class LearnRecord extends CoreEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column()
  @IsNumber()
  student_id: number;

  @Column()
  @IsNumber()
  course_id: number;

  @Column({ nullable: true })
  @IsDate()
  @IsOptional()
  last_learning_date?: Date;

  @Column({ nullable: true })
  @IsNumber()
  @IsOptional()
  last_lecture_id?: number;

  @CreateDateColumn()
  @IsDate()
  created_at: Date;

  @UpdateDateColumn()
  @IsDate()
  updated_at: Date;
}
