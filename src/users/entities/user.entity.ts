import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity, Long } from 'typeorm';

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

@Entity()
export class User extends CommonEntity {
  @Column('text')
  platform: string;

  @Column('text', { nullable: true })
  platformId?: string;

  @Column('text')
  nickname: string;

  @Column('enum', { nullable: true, enum: Gender })
  gender?: Gender;

  @Column('enum', { nullable: true, enum: AgeRange })
  age_range?: string;
}
