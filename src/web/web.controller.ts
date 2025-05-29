import { Controller, Get } from '@nestjs/common';
import { WebService } from './web.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('web')
export class WebController {
  constructor(private readonly webService: WebService) {}

  @Get()
  @Public()
  homePage() {
    return this.webService.homePage();
  }
}
