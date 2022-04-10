import CoreEntity from '@/commons/core.entity';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class TeacherRecord extends CoreEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column()
  @IsString()
  career: string;

  @Column({ unique: true })
  @IsNumber()
  user_id: number;

  @Column({ default: false })
  @IsBoolean()
  accepted: boolean;
}
