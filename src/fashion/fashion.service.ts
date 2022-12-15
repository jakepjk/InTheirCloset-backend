import { Injectable } from '@nestjs/common';
import { CreateFashionDto } from './dto/create-fashion.dto';
import { UpdateFashionDto } from './dto/update-fashion.dto';

@Injectable()
export class FashionService {
  create(createFashionDto: CreateFashionDto) {
    return 'This action adds a new fashion';
  }

  findAll() {
    return `This action returns all fashion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fashion`;
  }

  update(id: number, updateFashionDto: UpdateFashionDto) {
    return `This action updates a #${id} fashion`;
  }

  remove(id: number) {
    return `This action removes a #${id} fashion`;
  }
}
