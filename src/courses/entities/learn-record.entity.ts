import CoreEntity from '@/commons/core.entity';
import {
  IsInt,
  IsNumber,
  IsString,
  Max,
  Min,
  IsDate,
  IsOptional,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
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

  @Column()
  @IsDate()
  @IsOptional()
  last_learning_date?: Date;

  @Column()
  @IsNumber()
  @IsOptional()
  last_lecture_id?: number;

  @Column()
  @IsNumber()
  @IsOptional()
  next_lecture_id?: number;

  @CreateDateColumn()
  @IsDate()
  created_at: Date;

  @UpdateDateColumn()
  @IsDate()
  updated_at: Date;
}
