import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FashionService } from './fashion.service';
import { CreateFashionDto } from './dto/create-fashion.dto';
import { UpdateFashionDto } from './dto/update-fashion.dto';

@Controller('fashion')
export class FashionController {
  constructor(private readonly fashionService: FashionService) {}
}
