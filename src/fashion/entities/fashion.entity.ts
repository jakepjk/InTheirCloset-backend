import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Fashion extends CommonEntity {
  @Column('text')
  name: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('text', { nullable: true })
  code?: string;

  @Column('text', { nullable: true })
  purpose?: string;

  @Column('text', { nullable: true })
  material?: string;

  @Column('text', { nullable: true, array: true })
  color?: string[];

  @Column('text', { nullable: true })
  origin?: string;

  @Column('int', { nullable: true })
  releaseYear?: number;

  @Column('int', { nullable: true })
  releaseMonth?: number;

  @Column('text', { nullable: true })
  manufacturer?: string;

  @Column('text', { nullable: true })
  detailURL?: string;

  @Column('text', { array: true })
  representativeImage: string[];

  @Column('text', { nullable: true, array: true })
  images?: string[];
}
