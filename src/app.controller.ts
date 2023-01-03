import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get()
  Welcome() {
    return 'Welcome Fasion!';
  }
}
