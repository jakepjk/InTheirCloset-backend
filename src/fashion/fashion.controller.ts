import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FashionService } from './fashion.service';
import { CreateFashionDto } from './dto/create-fashion.dto';
import { UpdateFashionDto } from './dto/update-fashion.dto';

@Controller('fashion')
export class FashionController {
  constructor(private readonly fashionService: FashionService) {}

  @Post()
  create(@Body() createFashionDto: CreateFashionDto) {
    return this.fashionService.create(createFashionDto);
  }

  @Get()
  findAll() {
    return this.fashionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fashionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFashionDto: UpdateFashionDto) {
    return this.fashionService.update(+id, updateFashionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fashionService.remove(+id);
  }
}
