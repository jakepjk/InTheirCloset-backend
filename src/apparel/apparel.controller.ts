import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  GetApparelDetailDto,
  GetApparelsDto,
} from 'src/apparel/dto/get-apparel.dto';
import {
  RequestApparelBodyDto,
  RequestApparelDto,
} from 'src/apparel/dto/request-apparel.dto';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role/role.decorator';
import { User, UserRole } from 'src/users/entities/user.entity';
import { ApparelService } from './apparel.service';
import { CreateApparelDto } from './dto/create-apparel.dto';
import { UpdateApparelDto } from './dto/update-apparel.dto';

@Controller('apparel')
export class ApparelController {
  constructor(private readonly apparelService: ApparelService) {}

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ): Promise<GetApparelsDto> {
    return this.apparelService.findAll(search, limit, page);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<GetApparelDetailDto> {
    return this.apparelService.findOne(+id);
  }

  @Role([UserRole.Admin, UserRole.Manager])
  @Post()
  create(
    @Query('stash') stash: boolean,
    @AuthUser() user: User,
    @Body() requestApparelBodyDto: RequestApparelBodyDto,
  ): Promise<RequestApparelDto> {
    return this.apparelService.createRequest(
      stash,
      user,
      requestApparelBodyDto,
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApparelDto: UpdateApparelDto) {
    return this.apparelService.update(+id, updateApparelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apparelService.remove(+id);
  }
}
