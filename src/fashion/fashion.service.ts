import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Fashion } from 'src/fashion/entities/fashion.entity';
import { Repository } from 'typeorm';
import { CreateFashionDto } from './dto/create-fashion.dto';
import { UpdateFashionDto } from './dto/update-fashion.dto';

@Injectable()
export class FashionService {
  constructor(
    @InjectRepository(Fashion)
    private readonly fashionRepo: Repository<Fashion>,
  ) {}

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
