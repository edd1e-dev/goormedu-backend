import CoreEntity from '@/commons/core.entity';
import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { isNumber, IsNumber } from 'class-validator';

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
}
