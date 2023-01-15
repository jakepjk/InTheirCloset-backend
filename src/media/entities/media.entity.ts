import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsInt, IsString, IsUrl } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity } from 'typeorm';

export enum MediaType {
  Drama = 'drama',
}

@Entity()
export class Media extends CommonEntity {
  @Column('text')
  @IsString()
  @ApiProperty()
  title: string;

  @Column('text', { nullable: true })
  @IsString()
  @ApiProperty()
  subtitle?: string;

  @Column('enum', { enum: MediaType })
  @IsEnum(MediaType)
  @ApiProperty()
  type: MediaType;

  @Column('text', { nullable: true })
  @IsUrl()
  @ApiProperty()
  image?: string;

  @Column('text', { default: [], array: true })
  @IsArray()
  @ApiProperty()
  genre: string[];

  @Column('text', { nullable: true })
  @IsString()
  @ApiProperty()
  season?: string;

  @Column('int', { nullable: true })
  @IsInt()
  @ApiProperty()
  episodesNumber?: number;
}
