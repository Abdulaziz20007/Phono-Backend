import { PartialType } from '@nestjs/swagger';
import { CreateFavouriteItemDto } from './create-favourite-item.dto';

export class UpdateFavouriteItemDto extends PartialType(CreateFavouriteItemDto) {}
