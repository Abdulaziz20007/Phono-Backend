import { Injectable } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { BrandService } from '../brand/brand.service';

@Injectable()
export class WebService {
  constructor(
    private readonly productService: ProductService,
    private readonly brandService: BrandService,
  ) {}
  async homePage() {
    const allProducts = await this.productService.findAll();
    const brands = await this.brandService.findAll();

    const now = new Date();
    const filteredProducts = allProducts
      .filter((product) => product.is_checked === true)
      .sort(
        (a, b) => {
          // First sort by whether the product is top (has future expiration date)
          const aIsTop = new Date(a.top_expire_date) > now;
          const bIsTop = new Date(b.top_expire_date) > now;
          
          if (aIsTop && !bIsTop) return -1;
          if (!aIsTop && bIsTop) return 1;
          
          // Then sort by expiration date (newer expiration dates first)
          return new Date(b.top_expire_date).getTime() - 
                 new Date(a.top_expire_date).getTime();
        }
      )
      .slice(0, 20);

    return {
      products: filteredProducts,
      brands,
    };
  }
}
