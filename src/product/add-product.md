# product creation and image management

this guide explains how to create products and upload product images in the phono backend system.

## creating a product

### endpoint

```
POST /product
```

### authorization

requires authentication as either a user or admin.

### request body

```json
{
  "title": "iphone 15 pro max",
  "description": "brand new phone, used only for 1 month",
  "price": 1200,
  "currency_id": 1,
  "brand_id": 1,
  "model_id": 5,
  "color_id": 3,
  "memory": 256,
  "ram": 8,
  "year": 2023,
  "category_id": 1
}
```

| field       | type   | description                         | required |
| ----------- | ------ | ----------------------------------- | -------- |
| title       | string | product title                       | yes      |
| description | string | detailed product description        | yes      |
| price       | number | product price                       | yes      |
| currency_id | number | currency id (from currencies table) | yes      |
| brand_id    | number | brand id (e.g., apple, samsung)     | yes      |
| model_id    | number | model id associated with the brand  | yes      |
| color_id    | number | color id                            | yes      |
| memory      | number | storage capacity in gb              | yes      |
| ram         | number | ram capacity in gb                  | yes      |
| year        | number | release year                        | yes      |
| category_id | number | product category id                 | yes      |
| user_id     | number | user id (only for admin role)       | no       |

### response

returns the created product object with a generated id.

## uploading product images

after creating a product, you can upload one or multiple images for it.

### endpoint

```
POST /product-image
```

### authorization

requires authentication as either a user or admin.

### request format

use `multipart/form-data` format to upload files.

### request parameters

| field      | type    | description                                  | required |
| ---------- | ------- | -------------------------------------------- | -------- |
| product_id | number  | id of the product the images belong to       | yes      |
| is_main    | boolean | set to true if this should be the main image | no       |
| images     | file[]  | image files (jpg, jpeg, png, gif) - up to 10 | yes      |

### example request using curl

```bash
curl -X POST https://api.example.com/product-image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "product_id=123" \
  -F "is_main=true" \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg"
```

### response

returns an array of created product image objects, each with a generated id and url.

## updating product images

### endpoint

```
PATCH /product-image/:id
```

### authorization

requires authentication as either a user or admin.

### request parameters

| field   | type    | description                             | required |
| ------- | ------- | --------------------------------------- | -------- |
| is_main | boolean | set to true to make this the main image | no       |
| images  | file[]  | new image files to upload               | no       |

notes:

- when updating an existing product image record, the first image in the array will replace the current image
- any additional images will create new product image records
- at least one parameter must be provided

## setting an image as main

### endpoint

```
PATCH /product-image/:id/set-main
```

### authorization

requires authentication as either a user or admin.

### behavior

sets the specified image as the main image for its product and updates any other images for the same product to not be main.

## retrieving product images

### endpoint to get all product images

```
GET /product-image
```

### endpoint to get images for a specific product

```
GET /product-image?productId=123
```

### endpoint to get a specific image

```
GET /product-image/:id
```

### authorization

these endpoints are public and do not require authentication.

## deleting a product image

### endpoint

```
DELETE /product-image/:id
```

### authorization

requires authentication as either a user or admin.

## important notes

1. when uploading multiple images, the first image will be set as the main image if `is_main` is set to true
2. image files are stored on amazon s3 and urls are stored in the database
3. the maximum file size for an image is 5mb
4. only jpg, jpeg, png, and gif file formats are supported
5. you can upload up to 10 images in a single request
