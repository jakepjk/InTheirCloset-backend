import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, Long } from 'typeorm';
import { IsString, IsEnum, IsEmail, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Gender {
  male = 'male',
  female = 'female',
}

export enum AgeRange {
  '1~9' = '1~9',
  '10~14' = '10~14',
  '15~19' = '15~19',
  '20~29' = '20~29',
  '30~39' = '30~39',
  '40~49' = '40~49',
  '50~59' = '50~59',
  '60~69' = '60~69',
  '70~79' = '70~79',
  '80~89' = '80~89',
  '90~' = '90~',
}

export enum UserRole {
  Admin = 'Admin',
  Manager = 'Manager',
  Client = 'Client',
}

export enum Platform {
  KFL = 'kfl',
  Kakao = 'kakao',
  Naver = 'naver',
}

@Entity()
export class User extends CommonEntity {
  @Column('text', { nullable: true })
  @IsEmail()
  @ApiProperty()
  email?: string;

  @Column('text', { nullable: true })
  @IsString()
  @ApiProperty()
  password?: string;

  @Column('enum', { enum: Platform })
  @IsEnum(Platform)
  @ApiProperty()
  platform: Platform;

  @Column('text', { nullable: true })
  @IsString()
  @ApiProperty()
  platformId?: string;

  @Column('text')
  @IsString()
  @ApiProperty()
  nickname: string;

  @Column('enum', { nullable: true, enum: Gender })
  @IsEnum(Gender)
  @ApiProperty({ enum: Gender })
  gender?: Gender;

  // @Column('enum', { nullable: true, enum: AgeRange })
  // @IsEnum(AgeRange)
  // @ApiProperty()
  // ageRange?: string;

  @Column('int', { nullable: true })
  @IsInt()
  @ApiProperty()
  yearOfBirth?: number;

  @Column('enum', { enum: UserRole, default: UserRole.Client })
  @IsEnum(UserRole)
  @ApiProperty({ enum: UserRole })
  role: UserRole;
}
