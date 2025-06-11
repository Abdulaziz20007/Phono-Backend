# Phono API Documentation

This document provides detailed information about the RESTful API endpoints for the Phono application. The API follows standard HTTP methods and status codes.

## Authentication

Most endpoints require authentication using a JSON Web Token (JWT). Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

Authentication tokens can be obtained through the `/auth/login` endpoint.

## Common Response Formats

All responses follow a standard JSON format with appropriate HTTP status codes.

## API Endpoints

## Auth

### Register a new user

- **URL**: `/auth/register`
- **Method**: `POST`
- **Auth required**: No
- **Request Body**:
  ```json
  {
    "phone": "901234567",
    "password": "password123",
    "name": "John",
    "surname": "Doe"
  }
  ```
- **Success Response**: `201 Created`

### Send OTP code

- **URL**: `/auth/send-otp`
- **Method**: `POST`
- **Auth required**: No
- **Success Response**: `201 Created`

### Verify OTP code

- **URL**: `/auth/verify-otp`
- **Method**: `POST`
- **Auth required**: No
- **Request Body**:
  ```json
  {
    "otp": "123456",
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "expire": "2024-03-20T12:00:00Z",
    "phone": "901234567"
  }
  ```
- **Success Response**: `201 Created`

### User Login

- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth required**: No
- **Request Body**:
  ```json
  {
    "phone": "901234567",
    "password": "password123"
  }
  ```
- **Success Response**: `201 Created` with JWT token

### Refresh Token

- **URL**: `/auth/refresh-token`
- **Method**: `POST`
- **Auth required**: Yes
- **Success Response**: `201 Created` with new JWT token

### Logout

- **URL**: `/auth/logout`
- **Method**: `POST`
- **Auth required**: Yes
- **Success Response**: `201 Created`

### Admin Login

- **URL**: `/auth/admin/login`
- **Method**: `POST`
- **Auth required**: No
- **Request Body**:
  ```json
  {
    "phone": "901234567",
    "password": "password123"
  }
  ```
- **Success Response**: `201 Created` with JWT token

### Admin Refresh Token

- **URL**: `/auth/admin/refresh-token`
- **Method**: `POST`
- **Auth required**: Yes
- **Success Response**: `201 Created` with new JWT token

## Users

### Create User

- **URL**: `/user`
- **Method**: `POST`
- **Auth required**: Yes (Admin)
- **Request Body**:
  ```json
  {
    "phone": "901234567",
    "password": "password123",
    "name": "John",
    "surname": "Doe"
  }
  ```
- **Success Response**: `201 Created`

### Get All Users

- **URL**: `/user`
- **Method**: `GET`
- **Auth required**: Yes (Admin)
- **Success Response**: `200 OK` with list of users

### Get Current User

- **URL**: `/user/me`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK` with user data

### Get User by ID

- **URL**: `/user/{id}`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK` with user data

### Update User

- **URL**: `/user/{id}`
- **Method**: `PATCH`
- **Auth required**: Yes
- **Request Body**: Include fields to update
  ```json
  {
    "name": "John",
    "surname": "Doe",
    "avatar": "https://example.com/avatar.jpg",
    "currency_id": 1,
    "is_active": true
  }
  ```
- **Success Response**: `200 OK` with updated user data

### Delete User

- **URL**: `/user/{id}`
- **Method**: `DELETE`
- **Auth required**: Yes (Admin)
- **Success Response**: `200 OK`

### Get User Profile

- **URL**: `/user/profile/{id}`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK` with user profile data

### Update Password

- **URL**: `/user/password/{id}`
- **Method**: `PATCH`
- **Auth required**: Yes
- **Request Body**:
  ```json
  {
    "oldPassword": "OldPassword123!",
    "newPassword": "NewStrongPassword123!",
    "confirmNewPassword": "NewStrongPassword123!"
  }
  ```
- **Success Response**: `200 OK`

## Products

### Create Product

- **URL**: `/product`
- **Method**: `POST`
- **Auth required**: Yes
- **Request Body**:
  ```json
  {
    "user_id": 1,
    "title": "iPhone 13 Pro Max",
    "description": "Excellent condition, barely used",
    "year": 2023,
    "brand_id": 1,
    "model_id": 1,
    "custom_model": "Custom Model Name",
    "color_id": 1,
    "price": 999.99,
    "floor_price": false,
    "currency_id": 1,
    "is_new": true,
    "has_document": true,
    "address_id": 1,
    "phone_id": 1,
    "storage": 256,
    "ram": 8
  }
  ```
- **Success Response**: `201 Created` with product data

### Get All Products

- **URL**: `/product`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**: `200 OK` with list of products

### Get User's Products

- **URL**: `/product/user/{id}`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**: `200 OK` with list of user's products

### Get Products by Brand

- **URL**: `/product/brand/{id}`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**: `200 OK` with list of products for the brand

### Get Products by Model

- **URL**: `/product/model/{id}`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**: `200 OK` with list of products for the model

### Get Product by ID

- **URL**: `/product/{id}`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**: `200 OK` with product data

### Update Product

- **URL**: `/product/{id}`
- **Method**: `PATCH`
- **Auth required**: Yes (Owner)
- **Request Body**: Include fields to update
- **Success Response**: `200 OK` with updated product data

### Delete Product

- **URL**: `/product/{id}`
- **Method**: `DELETE`
- **Auth required**: Yes (Owner/Admin)
- **Success Response**: `200 OK`

### Upgrade Product

- **URL**: `/product/upgrade/{id}`
- **Method**: `PATCH`
- **Auth required**: Yes (Owner)
- **Request Body**: Upgrade configuration
- **Success Response**: `200 OK` with upgraded product data

### Search Products

- **URL**: `/product/search`
- **Method**: `POST`
- **Auth required**: No
- **Request Body**:
  - `search` (required): Text to search in product titles
  - `top`: Only return featured products (true/false)
  - `region_id`: Filter by region ID
  - `category_id`: Filter by category ID
  - `brand_id`: Filter by brand ID
  - `color_id`: Filter by color ID
  - `price_from`: Minimum price (inclusive)
  - `price_to`: Maximum price (inclusive)
  - `memory_from`: Minimum storage capacity in GB (inclusive)
  - `memory_to`: Maximum storage capacity in GB (inclusive)
  - `ram_from`: Minimum RAM capacity in GB (inclusive)
  - `ram_to`: Maximum RAM capacity in GB (inclusive)
- **Success Response**: `200 OK` with list of products matching the criteria, including related entities (images, brand, model, color, currency, user)
- **Response Example**:
  ```json
  [
    {
      "id": 123,
      "title": "iPhone 13 Pro Max",
      "description": "Excellent condition",
      "price": 899.99,
      "storage": 256,
      "ram": 6,
      "year": 2021,
      "images": [
        {
          "id": 456,
          "url": "https://example.com/images/product123_1.jpg",
          "is_main": true
        }
      ],
      "brand": {
        "id": 1,
        "name": "Apple"
      },
      "model": {
        "id": 5,
        "name": "iPhone 13 Pro Max"
      },
      "user": {
        "id": 42,
        "name": "John",
        "surname": "Doe"
      }
    }
  ]
  ```
- **Notes**:
  - Search is case-insensitive and uses partial matching
  - Results are returned in descending order by ID
  - The `memory_from` and `memory_to` parameters filter the `storage` field in the database

## Product Images

### Add Product Image

- **URL**: `/product-image`
- **Method**: `POST`
- **Auth required**: Yes (Owner)
- **Request Body**: Multipart form with image file and data
  ```json
  {
    "product_id": 1,
    "is_main": false,
    "image": [binary file]
  }
  ```
- **Success Response**: `201 Created` with image data

### Get Product Images

- **URL**: `/product-image?productId=1`
- **Method**: `GET`
- **Auth required**: No
- **Query Params**: `productId` (required)
- **Success Response**: `200 OK` with list of images

### Get Single Product Image

- **URL**: `/product-image/{id}`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**: `200 OK` with image data

### Update Product Image

- **URL**: `/product-image/{id}`
- **Method**: `PATCH`
- **Auth required**: Yes (Owner)
- **Request Body**: Multipart form with updated data
- **Success Response**: `200 OK` with updated image data

### Delete Product Image

- **URL**: `/product-image/{id}`
- **Method**: `DELETE`
- **Auth required**: Yes (Owner/Admin)
- **Success Response**: `204 No Content`

### Set Main Image

- **URL**: `/product-image/{id}/set-main`
- **Method**: `PATCH`
- **Auth required**: Yes (Owner)
- **Success Response**: `200 OK` with updated image data

## Brands

### Create Brand

- **URL**: `/brand`
- **Method**: `POST`
- **Auth required**: Yes (Admin)
- **Request Body**: Multipart form with brand data
  ```json
  {
    "name": "Samsung",
    "image": [binary file]
  }
  ```
- **Success Response**: `201 Created` with brand data

### Get All Brands

- **URL**: `/brand`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**: `200 OK` with list of brands

### Get Brand by ID

- **URL**: `/brand/{id}`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**: `200 OK` with brand data

### Update Brand

- **URL**: `/brand/{id}`
- **Method**: `PATCH`
- **Auth required**: Yes (Admin)
- **Request Body**: Multipart form with updated data
- **Success Response**: `200 OK` with updated brand data

### Delete Brand

- **URL**: `/brand/{id}`
- **Method**: `DELETE`
- **Auth required**: Yes (Admin)
- **Success Response**: `204 No Content`

## Models

### Create Model

- **URL**: `/model`
- **Method**: `POST`
- **Auth required**: Yes (Admin)
- **Request Body**:
  ```json
  {
    "name": "Galaxy S23",
    "brand_id": 1
  }
  ```
- **Success Response**: `201 Created` with model data

### Get All Models

- **URL**: `/model?brandId=1`
- **Method**: `GET`
- **Auth required**: No
- **Query Params**: `brandId` (required)
- **Success Response**: `200 OK` with list of models

### Get Models by Brand ID

- **URL**: `/model/brand/{id}`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**: `200 OK` with list of models for the brand

### Get Model by ID

- **URL**: `/model/{id}`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**: `200 OK` with model data

### Update Model

- **URL**: `/model/{id}`
- **Method**: `PATCH`
- **Auth required**: Yes (Admin)
- **Request Body**: Include fields to update
- **Success Response**: `200 OK` with updated model data

### Delete Model

- **URL**: `/model/{id}`
- **Method**: `DELETE`
- **Auth required**: Yes (Admin)
- **Success Response**: `204 No Content`

## Colors

### Create Color

- **URL**: `/color`
- **Method**: `POST`
- **Auth required**: Yes (Admin)
- **Request Body**:
  ```json
  {
    "name": "Qizil",
    "hex": "#FF0000"
  }
  ```
- **Success Response**: `201 Created` with color data

### Get All Colors

- **URL**: `/color`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**: `200 OK` with list of colors

### Get Color by ID

- **URL**: `/color/{id}`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**: `200 OK` with color data

### Update Color

- **URL**: `/color/{id}`
- **Method**: `PATCH`
- **Auth required**: Yes (Admin)
- **Request Body**: Include fields to update
- **Success Response**: `200 OK` with updated color data

### Delete Color

- **URL**: `/color/{id}`
- **Method**: `DELETE`
- **Auth required**: Yes (Admin)
- **Success Response**: `200 No Content`

## Currencies

### Create Currency

- **URL**: `/currency`
- **Method**: `POST`
- **Auth required**: Yes (Admin)
- **Request Body**:
  ```json
  {
    "name": "US Dollar",
    "symbol": "$"
  }
  ```
- **Success Response**: `201 Created` with currency data

### Get All Currencies

- **URL**: `/currency`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**: `200 OK` with list of currencies

### Get Currency by ID

- **URL**: `/currency/{id}`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**: `200 OK` with currency data

### Update Currency

- **URL**: `/currency/{id}`
- **Method**: `PATCH`
- **Auth required**: Yes (Admin)
- **Success Response**: `200 OK` with updated currency data

### Delete Currency

- **URL**: `/currency/{id}`
- **Method**: `DELETE`
- **Auth required**: Yes (Admin)
- **Success Response**: `204 No Content`

## OTP (One-Time Passwords)

### Create OTP

- **URL**: `/otp`
- **Method**: `POST`
- **Auth required**: Yes (Admin)
- **Request Body**:
  ```json
  {
    "user_id": 1,
    "otp": "123456",
    "expire": "2024-03-20T12:00:00Z",
    "uuid": "550e8400-e29b-41d4-a716-446655440000"
  }
  ```
- **Success Response**: `201 Created` with OTP data

### Get All OTPs

- **URL**: `/otp`
- **Method**: `GET`
- **Auth required**: Yes (Admin)
- **Success Response**: `200 OK` with list of OTPs

### Get OTP by ID

- **URL**: `/otp/{id}`
- **Method**: `GET`
- **Auth required**: Yes (Admin)
- **Success Response**: `200 OK` with OTP data

### Update OTP

- **URL**: `/otp/{id}`
- **Method**: `PATCH`
- **Auth required**: Yes (Admin)
- **Request Body**: Include fields to update
- **Success Response**: `200 OK` with updated OTP data

### Delete OTP

- **URL**: `/otp/{id}`
- **Method**: `DELETE`
- **Auth required**: Yes (Admin)
- **Success Response**: `200 OK`

## Phone Numbers

### Add Phone Number

- **URL**: `/phone`
- **Method**: `POST`
- **Auth required**: Yes
- **Request Body**:
  ```json
  {
    "phone": "901234567",
    "user_id": 1
  }
  ```
- **Success Response**: `201 Created` with phone data

### Get All Phone Numbers

- **URL**: `/phone`
- **Method**: `GET`
- **Auth required**: Yes (Admin)
- **Success Response**: `200 OK` with list of phone numbers

### Get Phone Number by ID

- **URL**: `/phone/{id}`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK` with phone data

### Update Phone Number

- **URL**: `/phone/{id}`
- **Method**: `PATCH`
- **Auth required**: Yes
- **Request Body**: Include fields to update
- **Success Response**: `200 OK` with updated phone data

### Delete Phone Number

- **URL**: `/phone/{id}`
- **Method**: `DELETE`
- **Auth required**: Yes
- **Success Response**: `204 No Content`

## Emails

### Add Email Address

- **URL**: `/email`
- **Method**: `POST`
- **Auth required**: Yes
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "user_id": 1
  }
  ```
- **Success Response**: `201 Created` with email data

### Get All Emails

- **URL**: `/email`
- **Method**: `GET`
- **Auth required**: Yes (Admin)
- **Success Response**: `200 OK` with list of emails

### Get Email by ID

- **URL**: `/email/{id}`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK` with email data

### Update Email

- **URL**: `/email/{id}`
- **Method**: `PATCH`
- **Auth required**: Yes
- **Request Body**: Include fields to update
- **Success Response**: `200 OK` with updated email data

### Delete Email

- **URL**: `/email/{id}`
- **Method**: `DELETE`
- **Auth required**: Yes
- **Success Response**: `200 OK`

### Verify Email

- **URL**: `/email/verify/{id}`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**: `200 OK` with verification status

## Addresses

### Add Address

- **URL**: `/address`
- **Method**: `POST`
- **Auth required**: Yes
- **Request Body**:
  ```json
  {
    "name": "Uy",
    "address": "Toshkent sh., Amir Temur ko'chasi, 1-uy",
    "lat": "41.2995",
    "long": "69.2401",
    "user_id": 1,
    "is_active": true
  }
  ```
- **Success Response**: `201 Created` with address data

### Get All Addresses

- **URL**: `/address`
- **Method**: `GET`
- **Auth required**: Yes (Admin)
- **Success Response**: `200 OK` with list of addresses

### Get Address by ID

- **URL**: `/address/{id}`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK` with address data

### Update Address

- **URL**: `/address/{id}`
- **Method**: `PATCH`
- **Auth required**: Yes
- **Request Body**: Include fields to update
- **Success Response**: `200 OK` with updated address data

### Delete Address

- **URL**: `/address/{id}`
- **Method**: `DELETE`
- **Auth required**: Yes
- **Success Response**: `200 OK`

## Favourite Items

### Add to Favourites

- **URL**: `/favourite-item`
- **Method**: `POST`
- **Auth required**: Yes
- **Request Body**:
  ```json
  {
    "product_id": 1
  }
  ```
- **Success Response**: `201 Created` with favourite item data

### Get All Favourites

- **URL**: `/favourite-item`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK` with list of favourites

### Get Favourite by ID

- **URL**: `/favourite-item/{id}`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK` with favourite item data

### Remove from Favourites

- **URL**: `/favourite-item/{id}`
- **Method**: `DELETE`
- **Auth required**: Yes
- **Success Response**: `200 OK`

## Comments

### Add Comment

- **URL**: `/comment`
- **Method**: `POST`
- **Auth required**: Yes
- **Request Body**:
  ```json
  {
    "user_id": 1,
    "product_id": 1,
    "text": "Bu ajoyib mahsulot!"
  }
  ```
- **Success Response**: `201 Created` with comment data

### Get All Comments

- **URL**: `/comment`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**: `200 OK` with list of comments

### Get Product Comments

- **URL**: `/comment/product/{id}`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**: `200 OK` with product comments

### Get Comment by ID

- **URL**: `/comment/{id}`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**: `200 OK` with comment data

### Update Comment

- **URL**: `/comment/{id}`
- **Method**: `PATCH`
- **Auth required**: Yes (Owner)
- **Request Body**: Include fields to update
- **Success Response**: `200 OK` with updated comment data

### Delete Comment

- **URL**: `/comment/{id}`
- **Method**: `DELETE`
- **Auth required**: Yes (Owner/Admin)
- **Success Response**: `204 No Content`

## Admin Users

### Create Admin

- **URL**: `/admin`
- **Method**: `POST`
- **Auth required**: Yes (Admin)
- **Request Body**: Multipart form with admin data
  ```json
  {
    "name": "John",
    "surname": "Doe",
    "birth_date": "1990-01-15",
    "phone": "901234567",
    "password": "SecureP@ss123",
    "confirm_password": "SecureP@ss123",
    "avatar": [binary file]
  }
  ```
- **Success Response**: `201 Created` with admin data

### Get All Admins

- **URL**: `/admin`
- **Method**: `GET`
- **Auth required**: Yes (Admin)
- **Success Response**: `200 OK` with list of admins

### Get Admin by ID

- **URL**: `/admin/{id}`
- **Method**: `GET`
- **Auth required**: Yes (Admin)
- **Success Response**: `200 OK` with admin data

### Update Admin

- **URL**: `/admin/{id}`
- **Method**: `PATCH`
- **Auth required**: Yes (Admin)
- **Request Body**: Include fields to update
- **Success Response**: `200 OK` with updated admin data

### Delete Admin

- **URL**: `/admin/{id}`
- **Method**: `DELETE`
- **Auth required**: Yes (Super Admin)
- **Success Response**: `204 No Content`

### Update Admin Password

- **URL**: `/admin/update-password/{id}`
- **Method**: `PATCH`
- **Auth required**: Yes (Admin)
- **Request Body**:
  ```json
  {
    "oldPassword": "OldPassword123!",
    "newPassword": "NewStrongPassword123!",
    "confirmNewPassword": "NewStrongPassword123!"
  }
  ```
- **Success Response**: `200 OK`

## User Blocks

### Block User

- **URL**: `/block`
- **Method**: `POST`
- **Auth required**: Yes (Admin)
- **Request Body**:
  ```json
  {
    "user_id": 1,
    "admin_id": 1,
    "reason": "Violation of terms",
    "expire_date": "2024-03-20T12:00:00Z"
  }
  ```
- **Success Response**: `201 Created` with block data

### Get All Blocks

- **URL**: `/block`
- **Method**: `GET`
- **Auth required**: Yes (Admin)
- **Success Response**: `200 OK` with list of blocks

### Get Block by ID

- **URL**: `/block/{id}`
- **Method**: `GET`
- **Auth required**: Yes (Admin)
- **Success Response**: `200 OK` with block data

### Update Block

- **URL**: `/block/{id}`
- **Method**: `PATCH`
- **Auth required**: Yes (Admin)
- **Request Body**: Include fields to update
- **Success Response**: `200 OK` with updated block data

### Remove Block

- **URL**: `/block/{id}`
- **Method**: `DELETE`
- **Auth required**: Yes (Admin)
- **Success Response**: `200 OK`

## Payments

### Create Payment

- **URL**: `/payment`
- **Method**: `POST`
- **Auth required**: Yes
- **Request Body**:
  ```json
  {
    "user_id": 1,
    "amount": 123.45,
    "payment_method_id": 2
  }
  ```
- **Success Response**: `201 Created` with payment data

### Get All Payments

- **URL**: `/payment`
- **Method**: `GET`
- **Auth required**: Yes (Admin)
- **Success Response**: `200 OK` with list of payments

### Get Payment by ID

- **URL**: `/payment/{id}`
- **Method**: `GET`
- **Auth required**: Yes (Owner/Admin)
- **Success Response**: `200 OK` with payment data

### Update Payment

- **URL**: `/payment/{id}`
- **Method**: `PATCH`
- **Auth required**: Yes (Admin)
- **Request Body**: Include fields to update
- **Success Response**: `200 OK` with updated payment data

### Delete Payment

- **URL**: `/payment/{id}`
- **Method**: `DELETE`
- **Auth required**: Yes (Admin)
- **Success Response**: `200 OK`

## Payment Methods

### Create Payment Method

- **URL**: `/payment-method`
- **Method**: `POST`
- **Auth required**: Yes (Admin)
- **Request Body**:
  ```json
  {
    "name": "Card"
  }
  ```
- **Success Response**: `201 Created` with payment method data

### Get All Payment Methods

- **URL**: `/payment-method`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**: `200 OK` with list of payment methods

### Get Payment Method by ID

- **URL**: `/payment-method/{id}`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**: `200 OK` with payment method data

### Update Payment Method

- **URL**: `/payment-method/{id}`
- **Method**: `PATCH`
- **Auth required**: Yes (Admin)
- **Request Body**: Include fields to update
- **Success Response**: `200 OK` with updated payment method data

### Delete Payment Method

- **URL**: `/payment-method/{id}`
- **Method**: `DELETE`
- **Auth required**: Yes (Admin)
- **Success Response**: `200 OK`

## Web

### Get Home Page Data

- **URL**: `/web`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**: `200 OK` with home page data
