import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, Long } from 'typeorm';
import { IsString, IsEnum } from 'class-validator';

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

@Entity()
export class User extends CommonEntity {
  @Column('text')
  @IsString()
  platform: string;

  @Column('text', { nullable: true })
  @IsString()
  platformId?: string;

  @Column('text')
  @IsString()
  nickname: string;

  @Column('enum', { nullable: true, enum: Gender })
  @IsEnum(Gender)
  gender?: Gender;

  @Column('enum', { nullable: true, enum: AgeRange })
  @IsEnum(AgeRange)
  age_range?: string;

  @Column('enum', { enum: UserRole, default: UserRole.Client })
  @IsEnum(UserRole)
  role: UserRole;
}
