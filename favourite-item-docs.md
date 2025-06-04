# favourite item documentation

## introduction

the favourite item feature allows users to save products they're interested in to a personal "favourites" list. this functionality helps users:

- track products they like for future reference
- quickly access products they're considering without searching
- build a personal collection of preferred items

## database structure

### favouriteitem model

the `FavouriteItem` model contains the following fields:

| field      | type    | description                                 |
| ---------- | ------- | ------------------------------------------- |
| id         | integer | primary key, auto-incremented               |
| product_id | integer | foreign key referencing the `Product` model |
| user_id    | integer | foreign key referencing the `User` model    |

#### relationships:

- **user**: many-to-one relationship with the `User` model
  - a user can have multiple favourite items
  - deletion of a user cascades to delete all their favourite items
- **product**: many-to-one relationship with the `Product` model
  - a product can be favourited by multiple users
  - deletion of a product cascades to delete all favourite item references

#### unique constraint:

the model includes a unique constraint on the combination of `user_id` and `product_id`. this ensures that a user cannot add the same product to their favourites multiple times.

## api endpoints

### 1. add product to favourites (admin & user)

- **url**: `/favourite-item`
- **method**: `POST`
- **auth required**: yes (admin or user)
- **roles**: `ADMIN`, `USER`
- **request body**:
  ```json
  {
    "product_id": 1,
    "user_id": 2 // optional, admin only
  }
  ```
- **success response**: `201 Created` with favourite item data
- **notes**:
  - when used by an admin, the optional `user_id` field can specify which user to create the favourite for
  - when used by a regular user, any provided `user_id` will be ignored, and the favourite will be created for the authenticated user

### 2. add product to user's favourites (user simplified endpoint)

- **url**: `/favourite-item/user/add`
- **method**: `POST`
- **auth required**: yes (user only)
- **roles**: `USER`
- **request body**:
  ```json
  {
    "product_id": 1
  }
  ```
- **success response**: `201 Created` with favourite item data
- **notes**:
  - simplified endpoint specifically for users
  - automatically uses the authenticated user's id

### 3. get all favourites

- **url**: `/favourite-item`
- **method**: `GET`
- **auth required**: yes (admin or user)
- **roles**: `ADMIN`, `USER`
- **success response**: `200 OK` with list of favourites
- **notes**:
  - for regular users, returns only their own favourites
  - for admins, returns all favourites across all users
  - includes the full product details in the response

### 4. get favourite by id

- **url**: `/favourite-item/{id}`
- **method**: `GET`
- **auth required**: yes (admin or user)
- **roles**: `ADMIN`, `USER`
- **success response**: `200 OK` with favourite item data
- **notes**:
  - for regular users, returns only if the favourite belongs to them
  - for admins, returns any favourite item
  - includes the full product details in the response

### 5. remove product from user's favourites by product id

- **url**: `/favourite-item/user/product/{productId}`
- **method**: `DELETE`
- **auth required**: yes (user only)
- **roles**: `USER`
- **success response**: `200 OK` with success message
- **notes**:
  - user-friendly endpoint that allows removal by product id instead of favourite item id
  - useful when you know the product id but not the favourite item id

### 6. remove from favourites by favourite item id

- **url**: `/favourite-item/{id}`
- **method**: `DELETE`
- **auth required**: yes (admin or user)
- **roles**: `ADMIN`, `USER`
- **success response**: `200 OK` with success message
- **notes**:
  - removes by favourite item id
  - regular users can only remove their own favourites
  - admins can remove any favourite

## usage examples

### adding a product to favourites

#### as a regular user:

**option 1** (standard endpoint):

```http
POST /favourite-item
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "product_id": 1
}
```

**option 2** (simplified user endpoint):

```http
POST /favourite-item/user/add
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "product_id": 1
}
```

#### as an admin:

```http
POST /favourite-item
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "product_id": 1,
  "user_id": 2  // specify which user to create the favourite for
}
```

### retrieving favourites

#### get all favourites for authenticated user:

```http
GET /favourite-item
Authorization: Bearer YOUR_JWT_TOKEN
```

#### get specific favourite by id:

```http
GET /favourite-item/5  // where 5 is the favourite item id
Authorization: Bearer YOUR_JWT_TOKEN
```

### removing favourites

#### as a regular user:

**option 1** (remove by favourite item id):

```http
DELETE /favourite-item/5  // where 5 is the favourite item id
Authorization: Bearer YOUR_JWT_TOKEN
```

**option 2** (remove by product id - more user-friendly):

```http
DELETE /favourite-item/user/product/1  // where 1 is the product id
Authorization: Bearer YOUR_JWT_TOKEN
```

#### as an admin:

```http
DELETE /favourite-item/5  // where 5 is the favourite item id
Authorization: Bearer YOUR_JWT_TOKEN
```

## best practices

### when to use which endpoint:

1. **for adding favourites**:

   - regular users should use `/favourite-item/user/add` (simpler)
   - admins should use `/favourite-item` when creating for other users

2. **for removing favourites**:
   - regular users should use `/favourite-item/user/product/{productId}` when they know the product id
   - use `/favourite-item/{id}` when you know the specific favourite item id

### frontend implementation suggestions:

1. **adding to favourites**:

   - implement a "heart" or "star" button on product cards/pages
   - call `/favourite-item/user/add` when user clicks this button
   - handle 400 error for products that are already in favourites

2. **displaying favourites**:

   - fetch data using GET `/favourite-item` endpoint
   - display as a list or grid of products
   - include removal functionality on each item

3. **removing from favourites**:

   - use `/favourite-item/user/product/{productId}` for removing directly from product view
   - use `/favourite-item/{id}` when removing from a favourites list where you have the favourite id

4. **error handling**:
   - provide user feedback when a product is already in favourites
   - handle 404 errors when trying to access or remove non-existent favourites

## common errors and troubleshooting

| error                                 | possible cause                                       | solution                                            |
| ------------------------------------- | ---------------------------------------------------- | --------------------------------------------------- |
| 400: mahsulot allaqachon sevimlilarda | trying to add a product that's already in favourites | check if product exists in favourites before adding |
| 400: mahsulot topilmadi               | referenced product doesn't exist                     | verify product id is valid                          |
| 400: foydalanuvchi topilmadi          | referenced user doesn't exist (admin only)           | verify user id is valid                             |
| 404: sevimli mahsulot topilmadi       | trying to access a non-existent favourite item       | verify favourite item id is valid                   |
| 403: ruxsat yo'q                      | trying to access or modify another user's favourites | ensure operations are only on user's own favourites |
