import CoreEntity from '@/commons/core.entity';
import {
  IsDate,
  IsInt,
  IsNumber,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export default class Course extends CoreEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column()
  @IsNumber()
  teacher_id: number;

  @Column()
  @IsNumber()
  category_id: number;

  @Column()
  @IsString()
  title: string;

  @Column()
  @IsString()
  description: string;

  @Column({ default: 1 })
  @IsInt()
  @Max(5)
  @Min(1)
  level: number;

  @Column()
  @IsUrl()
  cover_image: string;

  @CreateDateColumn()
  @IsDate()
  created_at: Date;

  @UpdateDateColumn()
  @IsDate()
  updated_at: Date;
}
