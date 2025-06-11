# Product Search

This guide explains how to search for products in the Phono backend system.

## Endpoint

```
POST /product/search
```

## Authorization

This endpoint is public and does not require authentication.

## Request Body

| Parameter   | Type    | Description                                | Required |
| ----------- | ------- | ------------------------------------------ | -------- |
| search      | string  | Text to search for in product titles       | yes      |
| top         | boolean | Only return top (featured) products        | no       |
| region_id   | number  | Filter by region ID                        | no       |
| category_id | number  | Filter by category ID                      | no       |
| brand_id    | number  | Filter by brand ID                         | no       |
| color_id    | number  | Filter by color ID                         | no       |
| price_from  | number  | Minimum price (inclusive)                  | no       |
| price_to    | number  | Maximum price (inclusive)                  | no       |
| memory_from | number  | Minimum storage capacity in GB (inclusive) | no       |
| memory_to   | number  | Maximum storage capacity in GB (inclusive) | no       |
| ram_from    | number  | Minimum RAM capacity in GB (inclusive)     | no       |
| ram_to      | number  | Maximum RAM capacity in GB (inclusive)     | no       |

## Example Requests

### Basic Search

```json
POST /product/search
Content-Type: application/json

{
  "search": "iphone"
}
```

### Advanced Filtering

```json
POST /product/search
Content-Type: application/json

{
  "search": "samsung",
  "brand_id": 2,
  "price_from": 500,
  "price_to": 1000,
  "memory_from": 128,
  "ram_from": 6
}
```

### Top Products Only

```json
POST /product/search
Content-Type: application/json

{
  "search": "smartphone",
  "top": true
}
```

### Regional Search

```json
POST /product/search
Content-Type: application/json

{
  "search": "macbook",
  "region_id": 3
}
```

### Using cURL

```bash
curl -X POST https://api.example.com/product/search \
  -H "Content-Type: application/json" \
  -d '{
    "search": "iphone",
    "brand_id": 1,
    "memory_from": 128,
    "price_from": 500,
    "price_to": 1200
  }'
```

## Response

Returns an array of product objects matching the search criteria, including associated images, brand, model, color, currency, and basic user information.

## Example Response

```json
[
  {
    "id": 123,
    "title": "iPhone 13 Pro Max",
    "description": "Excellent condition, barely used",
    "price": 899.99,
    "currency_id": 1,
    "brand_id": 1,
    "model_id": 5,
    "color_id": 3,
    "storage": 256,
    "ram": 6,
    "year": 2021,
    "is_new": true,
    "has_document": true,
    "user_id": 42,
    "created_at": "2023-06-15T10:30:00.000Z",
    "updated_at": "2023-06-15T10:30:00.000Z",
    "top_expire_date": "2023-07-15T10:30:00.000Z",
    "images": [
      {
        "id": 456,
        "url": "https://example.com/images/product123_1.jpg",
        "is_main": true
      },
      {
        "id": 457,
        "url": "https://example.com/images/product123_2.jpg",
        "is_main": false
      }
    ],
    "brand": {
      "id": 1,
      "name": "Apple"
    },
    "model": {
      "id": 5,
      "name": "iPhone 13 Pro Max",
      "brand_id": 1
    },
    "color": {
      "id": 3,
      "name": "Graphite"
    },
    "currency": {
      "id": 1,
      "code": "USD",
      "symbol": "$"
    },
    "user": {
      "id": 42,
      "name": "John",
      "surname": "Doe",
      "avatar": "https://example.com/avatars/john_doe.jpg"
    }
  }
  // Additional products...
]
```

## Important Notes

1. The search is case-insensitive and uses partial matching on product titles
2. All numeric filters (price, memory, ram) support range queries with both minimum and maximum values
3. Products marked as "top" have a `top_expire_date` field that indicates when their featured status expires
4. For featured products only, set the `top` parameter to `true`
5. When no filters are provided besides the search term, all matching products are returned
6. Results are returned in descending order of ID (newest first)
7. The `memory_from` and `memory_to` parameters filter by the `storage` field in the database
