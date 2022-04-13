import CoreEntity from '@/commons/core.entity';
import {
  IsBoolean,
  IsNumber,
  IsString,
  IsDate,
  IsUrl,
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
export default class Lecture extends CoreEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column()
  @IsNumber()
  teacher_id: number;

  @Column()
  @IsNumber()
  course_id: number;

  @Column()
  @IsNumber()
  chapter_id: number;

  @Column()
  @IsString()
  title: string;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  video_url?: string;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  content?: string;

  @Column()
  @IsNumber()
  order: number;

  @Column({ default: false })
  @IsBoolean()
  is_public: boolean;

  @CreateDateColumn()
  @IsDate()
  created_at: Date;

  @UpdateDateColumn()
  @IsDate()
  updated_at: Date;
}
