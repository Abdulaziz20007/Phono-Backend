import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BlocksService } from './block.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { Public } from '../common/decorators/public.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserType } from '../common/types/user.type';
import { AdminType } from '../common/types/admin.type';

@Controller('block')
export class BlockController {
  constructor(private readonly blockService: BlocksService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createBlockDto: CreateBlockDto, @GetUser() user: AdminType) {
    return this.blockService.create(createBlockDto);
  }

  @Get()
  @Roles(Role.USER, Role.ADMIN)
  findAll(@GetUser() user: UserType | AdminType) {
    return this.blockService.findAll(user);
  }

  @Get(':id')
  @Roles(Role.USER, Role.ADMIN)
  findOne(@Param('id') id: string, @GetUser() user: UserType | AdminType) {
    return this.blockService.findOne(+id, user);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateBlockDto: UpdateBlockDto,
    @GetUser() user: AdminType,
  ) {
    return this.blockService.update(+id, updateBlockDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string, @GetUser() user: AdminType) {
    return this.blockService.remove(+id);
  }
}
