# Phono Backend Project Structure

## Root Directory

- `endpoints.md`: API endpoints documentation
- `docs-json.json`: Generated OpenAPI documentation
- `package.json`: Project dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `tsconfig.build.json`: TypeScript build configuration
- `nest-cli.json`: NestJS CLI configuration
- `README.md`: Project documentation
- `.prettierrc`: Prettier configuration

## Prisma

- `prisma/schema.prisma`: Database schema definition
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
- `model/`: Product model management
- `otp/`: One-Time Password functionality
- `payment/`: Payment processing
- `payment-method/`: Payment methods management
- `phone/`: User phone numbers management
- `prisma/`: Prisma database service
- `product/`: Product management
- `product-image/`: Product images management
- `user/`: User management
- `web/`: Web-related functionality

### Common Utilities (common/)

- `decorators/`: Custom decorators
- `enums/`: Enum definitions
- `guards/`: Authentication and authorization guards
- `helpers/`: Helper functions
- `logger/`: Logging functionality
- `types/`: TypeScript type definitions
