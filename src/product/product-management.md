# Product Management

This guide explains how to manage your products in the Phono backend system, including editing, archiving, and upgrading products.

## Editing a Product

### Endpoint

```
PATCH /product/:id
```

### Authorization

Requires authentication as either a user or admin.

### Request Body

You can update any of the following fields:

```json
{
  "title": "iPhone 15 Pro Max (Updated)",
  "description": "Brand new phone, used only for 2 weeks",
  "price": 1150,
  "currency_id": 1,
  "brand_id": 1,
  "model_id": 5,
  "color_id": 3,
  "storage": 256,
  "ram": 8,
  "year": 2023,
  "is_new": true,
  "has_document": true,
  "address_id": 1,
  "phone_id": 1,
  "floor_price": true,
  "custom_model": "Special Edition"
}
```

| Field        | Type    | Description                        | Required |
| ------------ | ------- | ---------------------------------- | -------- |
| title        | string  | Product title                      | no       |
| description  | string  | Detailed product description       | no       |
| price        | number  | Product price                      | no       |
| currency_id  | number  | Currency ID                        | no       |
| brand_id     | number  | Brand ID (e.g., Apple, Samsung)    | no       |
| model_id     | number  | Model ID associated with the brand | no       |
| custom_model | string  | Custom model name if needed        | no       |
| color_id     | number  | Color ID                           | no       |
| storage      | number  | Storage capacity in GB             | no       |
| ram          | number  | RAM capacity in GB                 | no       |
| year         | number  | Release year                       | no       |
| is_new       | boolean | Whether product is new             | no       |
| has_document | boolean | Whether product has documentation  | no       |
| address_id   | number  | Address ID                         | no       |
| phone_id     | number  | Phone ID for contact               | no       |
| floor_price  | boolean | Whether price is negotiable        | no       |

**Note**: When a user updates their own product, they can only update the fields they have access to. Admins can update any product and specify a user_id.

### Example Request

```bash
curl -X PATCH https://api.example.com/product/123 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "iPhone 15 Pro Max (Updated)",
    "price": 1150,
    "description": "Brand new phone, used only for 2 weeks"
  }'
```

### Response

Returns the updated product object.

## Archiving a Product

When a product is no longer available or has been sold, you can archive it instead of deleting it.

### Archive Endpoint

```
PATCH /product/archive/:id
```

### Authorization

Requires authentication as either a user or admin.

### Request Body

```json
{
  "is_sold": true
}
```

For admin users only, an additional field can be specified:

```json
{
  "is_sold": true,
  "user_id": 42
}
```

| Field   | Type    | Description                       | Required |
| ------- | ------- | --------------------------------- | -------- |
| is_sold | boolean | Whether the product has been sold | no       |
| user_id | number  | User ID (for admin role only)     | no       |

**Notes**:

- If `is_sold` is set to `true`, the product will be marked as sold and archived
- If `is_sold` is not provided or set to `false`, the product will be archived but not marked as sold
- Archived products are not visible in search results
- Admin users can specify a user_id to archive products on behalf of a specific user

### Example Request

```bash
curl -X PATCH https://api.example.com/product/archive/123 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "is_sold": true
  }'
```

### Example Admin Request

```bash
curl -X PATCH https://api.example.com/product/archive/123 \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "is_sold": true,
    "user_id": 42
  }'
```

## Unarchiving a Product

You can unarchive a product to make it visible in search results again.

### Unarchive Endpoint

```
PATCH /product/unarchive/:id
```

### Authorization

Requires authentication as either a user or admin.

### Behavior

- Removes the archived status from the product
- Sets `is_sold` to `false`
- Makes the product visible in search results again

### Example Request

```bash
curl -X PATCH https://api.example.com/product/unarchive/123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Upgrading a Product

You can upgrade a product to make it appear as a "top" or featured product.

### Upgrade Endpoint

```
PATCH /product/upgrade/:id
```

### Authorization

Requires authentication as either a user or admin.

### Request Body

No body is required for users upgrading their own products.
Admins must specify a user_id when upgrading a product:

```json
{
  "user_id": 42
}
```

### Behavior

- Charges 10,000 units from the user's balance
- Sets the product's `top_expire_date` to 7 days from the current date
- Featured products appear at the top of search results
- Users cannot upgrade a product if their balance is insufficient
- Users cannot upgrade a product that is already featured (top_expire_date > current date)

### Example Request

```bash
curl -X PATCH https://api.example.com/product/upgrade/123 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### Example Admin Request

```bash
curl -X PATCH https://api.example.com/product/upgrade/123 \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 42
  }'
```

## Important Notes

1. Users can only edit, archive, unarchive, or upgrade their own products
2. Admins can edit, archive, unarchive, or upgrade any product by specifying a user_id
3. Archived products do not appear in search results
4. Featured (upgraded) products appear at the top of search results
5. Product upgrades last for 7 days and cost 10,000 balance units
6. The `is_sold` flag can be used to indicate that a product has been sold
7. Unarchiving a product automatically sets `is_sold` to false
8. Products can be archived without being marked as sold
