import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity } from 'typeorm';
import { IsString, IsEnum, IsNumber, IsArray } from 'class-validator';

@Entity()
export class Fashion extends CommonEntity {
  @Column('text')
  @IsString()
  name: string;

  @Column('text', { nullable: true })
  @IsString()
  description?: string;

  @Column('text', { nullable: true })
  @IsString()
  code?: string;

  @Column('text', { nullable: true })
  @IsString()
  purpose?: string;

  @Column('text', { nullable: true })
  @IsString()
  material?: string;

  @Column('text', { nullable: true, array: true })
  @IsArray()
  color?: string[];

  @Column('text', { nullable: true })
  @IsString()
  origin?: string;

  @Column('int', { nullable: true })
  @IsNumber()
  releaseYear?: number;

  @Column('int', { nullable: true })
  @IsNumber()
  releaseMonth?: number;

  @Column('text', { nullable: true })
  @IsString()
  manufacturer?: string;

  @Column('text', { nullable: true })
  @IsString()
  detailURL?: string;

  @Column('text', { array: true })
  @IsArray()
  representativeImage: string[];

  @Column('text', { nullable: true, array: true })
  @IsArray()
  images?: string[];
}
