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
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { Public } from '../common/decorators/public.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserType } from '../common/types/user.type';
import { AdminType } from '../common/types/admin.type';
import { UpgradeProductDto } from './dto/upgrade-product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { ArchiveProductDto } from './dto/archive-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles(Role.USER, Role.ADMIN)
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: UserType | AdminType,
  ) {
    return this.productService.create(createProductDto, user);
  }

  @Get()
  @Public()
  findAll() {
    return this.productService.findAll();
  }

  @Post('search')
  @Public()
  search(@Body() searchProductDto: SearchProductDto) {
    return this.productService.search(searchProductDto);
  }

  @Get('user/:id')
  @Public()
  findUserProducts(@Param('id') id: string) {
    return this.productService.findUserProducts(+id);
  }

  @Get('brand/:id')
  @Public()
  findByBrandId(@Param('id') id: string) {
    return this.productService.findByBrandId(+id);
  }

  @Get('model/:id')
  @Public()
  findByModelId(@Param('id') id: string) {
    return this.productService.findByModelId(+id);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.USER, Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: UserType | AdminType,
  ) {
    return this.productService.update(+id, updateProductDto, user);
  }

  @Patch('archive/:id')
  @Roles(Role.USER, Role.ADMIN)
  archive(
    @Param('id') id: string,
    @Body() archiveProductDto: ArchiveProductDto,
    @GetUser() user: UserType | AdminType,
  ) {
    return this.productService.archive(+id, archiveProductDto, user);
  }

  @Patch('unarchive/:id')
  @Patch('unarchive/:id')
  @Roles(Role.USER, Role.ADMIN)
  unarchive(@Param('id') id: string, @GetUser() user: UserType | AdminType) {
    return this.productService.unarchive(+id, user);
  }

  @Patch('upgrade/:id')
  @Roles(Role.USER, Role.ADMIN)
  upgrade(
    @Param('id') id: string,
    @GetUser() user: UserType | AdminType,
    @Body() upgradeProductDto: UpgradeProductDto,
  ) {
    return this.productService.upgrade(+id, user, upgradeProductDto);
  }

  @Delete(':id')
  @Roles(Role.USER, Role.ADMIN)
  remove(@Param('id') id: string, @GetUser() user: UserType | AdminType) {
    return this.productService.remove(+id, user);
  }
}
