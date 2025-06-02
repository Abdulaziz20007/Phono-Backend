export class SearchProductDto {
  search: string;
  region_id?: number;
  category_id?: number;
  brand_id?: number;
  color_id?: number;
  price_from?: number;
  price_to?: number;
  memory_from?: number;
  memory_to?: number;
  ram_from?: number;
  ram_to?: number;
}
