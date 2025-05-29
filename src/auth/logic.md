# Authentication System Documentation for Frontend Developers

## Overview

This document provides a comprehensive guide on how to integrate with the Phono backend authentication system. The authentication flow includes user registration, OTP verification, login, token management, and logout functionality.

## Base URL

All API endpoints are prefixed with `/auth`.

## Authentication Flow

1. **Register a new user**
2. **Verify with OTP**
3. **Login with credentials**
4. **Use access token for protected endpoints**
5. **Refresh token when expired**
6. **Logout when needed**

## Endpoints

### 1. User Registration

**Endpoint:** `POST /auth/register`

**Request Body:**

```json
{
  "phone": "901234567",
  "password": "password123",
  "name": "John",
  "surname": "Doe"
}
```

**Response:**

```json
{
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "expire": "2023-06-20T14:30:00.000Z",
  "phone": "901234567"
}
```

**Notes:**

- Phone number must follow the valid format (e.g., XXXXXXXXX)
- Password must be at least 6 characters long
- After successful registration, an OTP code will be sent to the provided phone number
- The response contains a UUID needed for the OTP verification step

### 3. Verify OTP

**Endpoint:** `POST /auth/verify-otp`

**Request Body:**

```json
{
  "otp": "123456",
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "phone": "901234567"
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Notes:**

- The OTP verification marks the user as active
- Upon successful verification, you'll receive an access token
- The refresh token is automatically set as an HTTP-only cookie

### 4. Login

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "phone": "901234567",
  "password": "password123"
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Notes:**

- The refresh token is automatically set as an HTTP-only cookie
- Use the access token for subsequent authenticated requests

### 5. Refresh Token

**Endpoint:** `POST /auth/refresh-token`

**Request:** No request body needed. The refresh token is automatically sent from cookies.

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Notes:**

- Use this endpoint when the access token expires
- A new refresh token will be set in the cookies

### 6. Logout

**Endpoint:** `POST /auth/logout`

**Request:** No request body needed.

**Response:** Success message

**Notes:**

- This endpoint clears the refresh token cookie

## Authentication Usage in Frontend

### 1. Setting Up Authentication Headers

For authenticated requests, include the access token in the Authorization header:

```javascript
const headers = {
  Authorization: `Bearer ${accessToken}`,
  'Content-Type': 'application/json',
};

fetch('https://api.example.com/protected-endpoint', {
  method: 'GET',
  headers: headers,
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error('Error:', error));
```

### 2. Managing Token Expiration

1. Implement an interceptor to handle 401 (Unauthorized) responses
2. When a 401 is received, call the refresh token endpoint
3. Retry the original request with the new access token
4. If refresh fails, redirect to login

Example with Axios:

```javascript
// Add a response interceptor
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh token endpoint
        const response = await axios.post('/auth/refresh-token');
        const { accessToken } = response.data;

        // Update token in storage
        localStorage.setItem('accessToken', accessToken);

        // Update the authorization header
        axios.defaults.headers.common['Authorization'] =
          `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        // Retry the original request
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
```

## Security Considerations

1. Always use HTTPS for API communication
2. Store the access token securely (e.g., in memory or secure storage)
3. Never store tokens in localStorage for production applications
4. Implement proper token expiration handling
5. Logout users properly when they close the application

## Admin Authentication

For admin authentication, use these separate endpoints:

1. **Admin Login:** `POST /auth/admin/login`
2. **Admin Refresh Token:** `POST /auth/admin/refresh-token`

The request and response formats are the same as the user endpoints.

## Common Error Responses

- **400 Bad Request**: Invalid data provided
- **401 Unauthorized**: Authentication failed
- **403 Forbidden**: Not enough permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side issue

## Testing the Authentication Flow

1. Register a new user with valid information
2. Verify the OTP code received
3. Login with the registered credentials
4. Make authenticated requests with the access token
5. Test token refresh logic
6. Logout and verify token invalidation

## CORS (Cross-Origin Resource Sharing)

### Overview

CORS is a security feature implemented by browsers that restricts web applications from making requests to a domain different from the one that served the web application. The backend has CORS configurations to allow frontend applications to communicate with it securely.

### Frontend Considerations

1. **Credentials Inclusion**: When making requests from the frontend that include cookies (like the refresh token), you must include the `credentials` option:

```javascript
fetch('https://api.example.com/auth/refresh-token', {
  method: 'POST',
  credentials: 'include', // Required for cookies to be sent
  headers: {
    'Content-Type': 'application/json',
  },
});
```

With Axios:

```javascript
axios.defaults.withCredentials = true; // Global setting

// Or for individual requests
axios.post(
  'https://api.example.com/auth/refresh-token',
  {},
  {
    withCredentials: true,
  },
);
```

### Common CORS Issues

1. **Cookies Not Being Sent**: Ensure you're using the `credentials: 'include'` option for fetch or `withCredentials: true` for Axios.

2. **Preflight Requests Failing**: For requests with custom headers or non-simple methods, browsers send a preflight OPTIONS request. Ensure your server properly handles these requests.

3. **Origin Not Allowed**: If you see errors about the origin not being allowed, contact the backend team to whitelist your frontend domain.

### Troubleshooting

If you encounter CORS errors (usually visible in browser console):

1. Check that your frontend domain is whitelisted in the backend CORS configuration
2. Ensure you're including credentials properly when needed
3. Verify that all required CORS headers are being returned by the server
4. Use browser developer tools to inspect the network requests and responses for CORS-related headers
