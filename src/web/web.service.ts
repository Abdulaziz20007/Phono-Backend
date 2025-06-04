import { Injectable } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { BrandService } from '../brand/brand.service';
import { ColorService } from '../color/color.service';
import { RegionService } from '../region/region.service';

@Injectable()
export class WebService {
  constructor(
    private readonly productService: ProductService,
    private readonly brandService: BrandService,
    private readonly colorService: ColorService,
    private readonly regionService: RegionService,
  ) {}
  async homePage() {
    const allProducts = await this.productService.findAll();
    const brands = await this.brandService.findAll();
    const colors = await this.colorService.findAll();
    const regions = await this.regionService.findAll();
    const now = new Date();
    const filteredProducts = allProducts
      .filter(
        (product) =>
          product.is_checked === true &&
          product.is_sold === false &&
          product.is_archived === false,
      )
      .sort((a, b) => {
        // First sort by whether the product is top (has future expiration date)
        const aIsTop = new Date(a.top_expire_date) > now;
        const bIsTop = new Date(b.top_expire_date) > now;

        if (aIsTop && !bIsTop) return -1;
        if (!aIsTop && bIsTop) return 1;

        // For non-top products, sort by creation date or other criteria
        if (!aIsTop && !bIsTop) {
          return b.id - a.id; // Sort by ID (newer first) as fallback
        }

        // For top products, sort by expiration date (newer expiration dates first)
        return (
          new Date(b.top_expire_date).getTime() -
          new Date(a.top_expire_date).getTime()
        );
      })
      .slice(0, 20);

    return {
      products: filteredProducts,
      brands,
      colors,
      regions,
    };
  }
}
