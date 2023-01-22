import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsString, IsUrl } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Apparel extends CommonEntity {
  @Column('text', { nullable: true, array: true })
  @IsArray()
  @ApiProperty()
  categories?: string[];

  @Column('text')
  @IsString()
  @ApiProperty()
  code: string;

  @Column('text')
  @IsString()
  @ApiProperty()
  name: string;

  @Column('text', { nullable: true })
  @IsString()
  @ApiProperty()
  description?: string;

  @Column('text', { nullable: true })
  @IsString()
  @ApiProperty()
  manufacturer?: string;

  @Column('text', { nullable: true, array: true })
  @IsArray()
  @ApiProperty()
  material?: string[];

  @Column('text', { nullable: true, array: true })
  @IsArray()
  @ApiProperty()
  color?: string[];

  @Column('int', { nullable: true })
  @IsInt()
  @ApiProperty()
  releaseYear?: number;

  @Column('int', { nullable: true })
  @IsInt()
  @ApiProperty()
  releaseMonth?: number;

  @Column('text', { nullable: true })
  @IsUrl()
  @ApiProperty()
  detailUrl?: string;

  @Column('text', { nullable: true })
  @IsString()
  @ApiProperty()
  origin?: string;

  @Column('text')
  @IsUrl()
  @ApiProperty()
  representativeImage: string;

  @Column('text', { nullable: true, array: true })
  @IsArray()
  @ApiProperty()
  images?: string[];

  @Column('int', { default: 0 })
  @ApiProperty()
  views: number;
}
