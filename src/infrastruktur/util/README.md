# Infrastructure Utilities

Folder ini berisi utility functions dan classes untuk keperluan infrastructure seperti error handling, response formatting, password encryption, dan JWT token management.

## Files

- `error-aplikasi.util.ts` - Custom error class dan error factory
- `response-builder.util.ts` - Response formatting utilities
- `enkripsi.util.ts` - Password hashing dan validation
- `jwt.util.ts` - JWT token generation dan verification

## Error Handling

### ErrorAplikasi Class

Custom error class dengan kode error dan status HTTP:

```typescript
import { ErrorAplikasi, ERROR_CODES } from '@infrastruktur/util';

throw new ErrorAplikasi(
  ERROR_CODES.AUTH_001,
  'Token tidak valid',
  401,
  { detail: 'Token expired' }
);
```

### ErrorFactory

Helper functions untuk create common errors:

```typescript
import { ErrorFactory } from '@infrastruktur/util';

// Authentication errors
throw ErrorFactory.tokenTidakValid();
throw ErrorFactory.kredensialSalah();
throw ErrorFactory.aksesDitolak();

// Booking errors
throw ErrorFactory.slotTidakTersedia();
throw ErrorFactory.jamTidakValid();

// Validation errors
throw ErrorFactory.validasiGagal('Email tidak valid');
```

## Response Formatting

### ResponseBuilder

Utility untuk format response yang konsisten:

```typescript
import { ResponseBuilder } from '@infrastruktur/util';

// Success response
return res.json(ResponseBuilder.sukses(data, 'Data berhasil diambil'));

// Created response (201)
return res.status(201).json(ResponseBuilder.created(newData));

// Error response
return res.status(400).json(ResponseBuilder.error('Data tidak valid', 'VALIDATION_001'));

// Paginated response
return res.json(
  ResponseBuilder.suksesPaginated(items, total, page, limit)
);
```

## Password Encryption

### EnkripsiUtil

Utility untuk password hashing dengan bcrypt:

```typescript
import { EnkripsiUtil } from '@infrastruktur/util';

// Hash password
const hashedPassword = await EnkripsiUtil.hashPassword('password123');

// Verify password
const isValid = await EnkripsiUtil.bandingkanPassword('password123', hashedPassword);

// Validate password strength
const validation = EnkripsiUtil.validatePasswordStrength('weak');
if (!validation.isValid) {
  console.log(validation.pesan); // "Password harus minimal 8 karakter"
}

// Generate random password
const randomPassword = EnkripsiUtil.generateRandomPassword(12);
```

## JWT Token

### JwtUtil

Utility untuk JWT token operations:

```typescript
import { JwtUtil, PayloadToken } from '@infrastruktur/util';

// Generate token
const payload: Omit<PayloadToken, 'iat' | 'exp'> = {
  id: user.id,
  email: user.email,
  role: 'pelanggan',
};
const token = JwtUtil.generateToken(payload);

// Verify token
try {
  const decoded = JwtUtil.verifikasiToken(token);
  console.log(decoded.id, decoded.email, decoded.role);
} catch (error) {
  // Token invalid atau expired
}

// Extract token from Authorization header
const token = JwtUtil.extractTokenFromHeader(req.headers.authorization);

// Check if token expired
const isExpired = JwtUtil.isTokenExpired(token);

// Generate refresh token (7 days expiration)
const refreshToken = JwtUtil.generateRefreshToken(payload);
```

## Best Practices

### Error Handling

1. Selalu gunakan ErrorFactory untuk create errors
2. Jangan expose internal error details ke client
3. Log error details untuk debugging

### Response Formatting

1. Selalu gunakan ResponseBuilder untuk consistency
2. Gunakan semantic methods (created, updated, deleted)
3. Include meaningful messages

### Password Security

1. Selalu hash password sebelum simpan ke database
2. Validate password strength sebelum hash
3. Jangan log atau expose plain passwords

### JWT Token

1. Simpan JWT_SECRET di environment variables
2. Set expiration time yang reasonable (24h untuk access token)
3. Implement refresh token untuk better UX
4. Validate token di setiap protected endpoint
