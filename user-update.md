# User Update API Instructions

## Endpoint

```
PATCH /user/:id
```

- `:id` — The ID of the user to update.
- Requires authentication (user or admin role).

## Request Content Types

### 1. Update User Data (JSON only)

Send a JSON body to update user fields (except avatar):

```
PATCH /user/123
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "New Name",
  "surname": "New Surname",
  "currency_id": 2,
  "is_active": true
}
```

### 2. Update User Data with Avatar (multipart/form-data)

To update the avatar (profile photo), use `multipart/form-data` and include the image file with the field name `avatar`:

```
PATCH /user/123
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body:
- avatar: <image file> (optional, e.g. avatar.jpg/png)
- name: New Name (optional)
- surname: New Surname (optional)
- currency_id: 2 (optional)
- is_active: true (optional)
```

**Note:**

- If you include an `avatar` file, it will be uploaded to S3 and the user's `avatar` field will be set to the resulting URL.
- You can send other fields along with the avatar in the same request.
- If you do not include an avatar, only the provided fields will be updated.

## Example (using curl)

**Update name and avatar:**

```sh
curl -X PATCH "https://your-api-url.com/user/123" \
  -H "Authorization: Bearer <token>" \
  -F "avatar=@/path/to/avatar.jpg" \
  -F "name=New Name"
```

**Update only name:**

```sh
curl -X PATCH "https://your-api-url.com/user/123" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "New Name"}'
```

## Fields Supported

- `name` (string, optional)
- `surname` (string, optional)
- `currency_id` (number, optional)
- `is_active` (boolean, optional)
- `avatar` (file, optional, only with multipart/form-data)

## Response

Returns the updated user object, including the new avatar URL if updated.

---

For more details, see the OpenAPI/Swagger documentation or contact the backend team.
