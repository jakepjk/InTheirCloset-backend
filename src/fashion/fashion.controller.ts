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

  /**
   * Create Fashion Item with image URL
   */

  /**
   * Create Fashion Item with image ID
   */

  /**
   * Update Fashion Item exclude image
   */

  /**
   * Add Image of Fashion Item with URL
   */

  /**
   * Add Image of Fashion Item with ID
   */

  /**
   * Delete one or more Image of Fashion Item
   */
}
