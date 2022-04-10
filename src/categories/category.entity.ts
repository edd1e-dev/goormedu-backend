import CoreEntity from '@/commons/core.entity';
import { IsNumber, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Category extends CoreEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column({ unique: true })
  @IsString()
  name: string;
}
