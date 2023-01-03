import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity } from 'typeorm';
import { IsString, IsEnum, IsNumber, IsArray } from 'class-validator';

@Entity()
export class FashionCategory extends CommonEntity {
  @Column()
  name: string;
}
