import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsInt, IsString, IsUrl } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Media, MediaType } from 'src/media/entities/media.entity';
import { RequestStatus, RequestType } from 'src/requests/request.enum';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToOne } from 'typeorm';

@Entity()
export class RequestMedia extends CommonEntity {
  @ApiProperty()
  @Column('enum', { enum: RequestType })
  @IsEnum(RequestType)
  requestType: RequestType;

  @ApiProperty()
  @ManyToOne(() => User, { eager: true })
  @JoinTable()
  requester: User;

  @ApiProperty()
  @Column('enum', { enum: RequestStatus })
  @IsEnum(RequestStatus)
  status: RequestStatus;

  @ApiProperty()
  @Column('text', { nullable: true })
  @IsString()
  comment?: string;

  @ApiProperty()
  @ManyToOne(() => Media, { eager: true, nullable: true })
  @JoinTable()
  media?: Media;

  // 이 아래는 등록, 변경될 media 내부 정보
  @ApiProperty()
  @Column('text', { nullable: true })
  @IsString()
  title?: string;

  @ApiProperty()
  @Column('text', { nullable: true })
  @IsString()
  subtitle?: string;

  @ApiProperty()
  @Column('enum', { enum: MediaType, nullable: true })
  @IsEnum(MediaType)
  type?: MediaType;

  @ApiProperty()
  @Column('text', { nullable: true })
  @IsUrl()
  image?: string;

  @ApiProperty()
  @Column('text', { default: [], array: true, nullable: true })
  @IsArray()
  genre?: string[];

  @ApiProperty()
  @Column('text', { nullable: true })
  @IsString()
  season?: string;

  @ApiProperty()
  @Column('int', { nullable: true })
  @IsInt()
  episodesNumber?: number;
}
