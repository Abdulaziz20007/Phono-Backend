import { Controller, Post } from '@nestjs/common';
import { InitService } from './init.service';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';

@Controller('init')
export class InitController {
  constructor(private readonly initService: InitService) {}

  @Post()
  @Roles(Role.ADMIN)
  create() {
    return this.initService.create();
  }
}
