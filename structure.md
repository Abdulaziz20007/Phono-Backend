# Phono Backend Project Structure

## Root Directory

- `endpoints.md`: API endpoints documentation
- `docs-json.json`: Generated OpenAPI documentation
- `favourite-item-docs.md`: Detailed documentation for favourite item functionality
- `package.json`: Project dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `tsconfig.build.json`: TypeScript build configuration
- `nest-cli.json`: NestJS CLI configuration
- `README.md`: Project documentation
- `.prettierrc`: Prettier configuration

## Prisma

- `prisma/schema.prisma`: Database schema definition with models for User, Admin, Region, Product, Brand, etc.
- `prisma/migrations/`: Database migration files

## Source Code Structure (src/)

- `main.ts`: Application entry point
- `app.module.ts`: Root application module

### Modules

- `address/`: Address management functionality
- `admin/`: Admin user management
- `auth/`: Authentication and authorization
- `block/`: User blocking functionality
- `brand/`: Product brands management
- `color/`: Product color management
- `comment/`: Product comments functionality
- `common/`: Shared utilities, guards, decorators
- `currency/`: Currency management
- `email/`: Email functionality
- `favourite-item/`: User favorites management
- `file-amazon/`: Amazon S3 file upload functionality
- `init/`: Database initialization and seeding
  - `init.module.ts`: Module definition
  - `init.controller.ts`: Controller for handling initialization requests
  - `init.service.ts`: Service implementing database seeding
  - `data/data.ts`: Seed data for initialization (currencies, regions, users, etc.)
  - `dto/create-init.dto.ts`: Data transfer object for initialization
- `model/`: Product model management
- `otp/`: One-Time Password functionality
- `payment/`: Payment processing
- `payment-method/`: Payment methods management
- `phone/`: User phone numbers management
- `prisma/`: Prisma database service
  - `prisma.service.ts`: Extends PrismaClient to provide database access
  - `prisma.module.ts`: Module definition for Prisma service
- `product/`: Product management
- `product-image/`: Product images management
- `region/`: Region management functionality
- `user/`: User management
- `web/`: Web-related functionality

### Common Utilities (common/)

- `decorators/`: Custom decorators
- `enums/`: Enum definitions
- `guards/`: Authentication and authorization guards
- `helpers/`: Helper functions
- `logger/`: Logging functionality
- `types/`: TypeScript type definitions

### Database Models

The application uses Prisma ORM with the following models:

- `User`: User accounts and profile information
- `Admin`: Administrative user accounts
- `Region`: Geographical regions
- `Address`: User addresses linked to regions
- `Brand`: Device brands (e.g., Apple, Samsung)
- `Model`: Device models linked to brands
- `Color`: Color options for devices
- `Currency`: Currency types for pricing
- `Product`: Phone listings with details
- `ProductImage`: Images for product listings
- `Phone`: Phone contact information
- `Email`: User email addresses
- `FavouriteItem`: User's favorite products
- `Comment`: User comments on products
- `Block`: User blocks by admins
- `Payment`: Payment records
- `PaymentMethod`: Available payment methods
- `Otp`: One-time passwords for verification
