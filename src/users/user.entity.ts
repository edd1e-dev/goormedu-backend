import { UserRole } from '@/commons/interfaces';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsDate, IsEmail, IsEnum, IsNumber, IsString } from 'class-validator';
import CoreEntity from '@/commons/core.entity';

@Entity()
export default class User extends CoreEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  username: string;

  @Column({ unique: true })
  @IsString()
  sub: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.Student })
  @IsEnum(UserRole)
  role: UserRole;

  @CreateDateColumn()
  @IsDate()
  created_at: Date;

  @UpdateDateColumn()
  @IsDate()
  updated_at: Date;
}
