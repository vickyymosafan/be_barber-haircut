# Middleware

Folder ini berisi middleware untuk Express.js yang menangani autentikasi, otorisasi, dan error handling.

## Files

- `types.ts` - Custom Request interface dengan user data
- `autentikasi.middleware.ts` - JWT authentication middleware
- `otorisasi.middleware.ts` - Role-based authorization middleware
- `error-handler.middleware.ts` - Global error handler dan utilities

## Authentication Middleware

### autentikasiMiddleware

Middleware untuk memverifikasi JWT token dan attach user data ke request:

```typescript
import { autentikasiMiddleware } from '@infrastruktur/middleware';

// Protect endpoint dengan autentikasi
router.get('/profile', autentikasiMiddleware, profileController);
```

**Behavior:**
- Extract token dari `Authorization: Bearer <token>` header
- Verify token menggunakan JWT_SECRET
- Attach decoded user data ke `req.user`
- Throw error 401 jika token tidak ada atau invalid

### autentikasiOptionalMiddleware

Middleware untuk autentikasi optional (tidak throw error jika token tidak ada):

```typescript
import { autentikasiOptionalMiddleware } from '@infrastruktur/middleware';

// Endpoint bisa diakses dengan atau tanpa autentikasi
router.get('/products', autentikasiOptionalMiddleware, productsController);
```

**Use Case:** Endpoint yang behavior-nya berbeda untuk authenticated vs unauthenticated users.

## Authorization Middleware

### otorisasiMiddleware

Higher-order function yang return middleware untuk role-based access control:

```typescript
import { otorisasiMiddleware } from '@infrastruktur/middleware';

// Hanya admin yang bisa akses
router.delete('/users/:id', 
  autentikasiMiddleware,
  otorisasiMiddleware(['admin']),
  deleteUserController
);

// Admin dan pelanggan bisa akses
router.get('/bookings',
  autentikasiMiddleware,
  otorisasiMiddleware(['admin', 'pelanggan']),
  getBookingsController
);
```

### Shortcut Middleware

Untuk convenience, tersedia shortcut middleware:

```typescript
import {
  adminOnlyMiddleware,
  pelangganOnlyMiddleware,
  authenticatedOnlyMiddleware,
} from '@infrastruktur/middleware';

// Admin only
router.post('/admin/settings', autentikasiMiddleware, adminOnlyMiddleware, controller);

// Pelanggan only
router.get('/my-bookings', autentikasiMiddleware, pelangganOnlyMiddleware, controller);

// Semua authenticated users
router.get('/profile', autentikasiMiddleware, authenticatedOnlyMiddleware, controller);
```

## Error Handler Middleware

### errorHandlerMiddleware

Global error handler yang menangkap semua errors:

```typescript
import { errorHandlerMiddleware } from '@infrastruktur/middleware';

// Register SETELAH semua routes
app.use(errorHandlerMiddleware);
```

**Behavior:**
- Catch `ErrorAplikasi` dan return structured error response
- Catch unhandled errors dan return generic 500 response
- Log unhandled errors untuk debugging (tidak expose ke client)
- Consistent error response format

### notFoundMiddleware

Middleware untuk handle 404 Not Found:

```typescript
import { notFoundMiddleware } from '@infrastruktur/middleware';

// Register SEBELUM error handler, SETELAH semua routes
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
```

### asyncErrorWrapper

Utility untuk wrap async route handlers:

```typescript
import { asyncErrorWrapper } from '@infrastruktur/middleware';

router.get('/users', asyncErrorWrapper(async (req, res) => {
  const users = await userService.getAll();
  res.json(ResponseBuilder.sukses(users));
}));
```

**Alasan:** Async errors tidak otomatis di-catch oleh Express, wrapper ini memastikan errors di-pass ke error handler.

## Usage Example

### Complete Route Setup

```typescript
import express from 'express';
import {
  autentikasiMiddleware,
  adminOnlyMiddleware,
  errorHandlerMiddleware,
  notFoundMiddleware,
  asyncErrorWrapper,
} from '@infrastruktur/middleware';

const app = express();

// Body parser
app.use(express.json());

// Public routes
app.get('/api/layanan', asyncErrorWrapper(getLayananController));
app.get('/api/barber', asyncErrorWrapper(getBarberController));

// Authenticated routes
app.get('/api/profile',
  autentikasiMiddleware,
  asyncErrorWrapper(getProfileController)
);

// Admin routes
app.post('/api/admin/barber',
  autentikasiMiddleware,
  adminOnlyMiddleware,
  asyncErrorWrapper(createBarberController)
);

// 404 handler (setelah semua routes)
app.use(notFoundMiddleware);

// Error handler (paling akhir)
app.use(errorHandlerMiddleware);
```

## Custom Request Type

Untuk type safety saat mengakses `req.user`:

```typescript
import { AuthenticatedRequest } from '@infrastruktur/middleware';

async function getProfileController(req: AuthenticatedRequest, res: Response) {
  // req.user sudah ter-type dengan PayloadToken
  const userId = req.user!.id;
  const userEmail = req.user!.email;
  const userRole = req.user!.role;
  
  // ... rest of controller logic
}
```

## Best Practices

### Middleware Order

1. Body parsers (express.json, express.urlencoded)
2. CORS, Helmet (security middleware)
3. Logging middleware
4. Public routes
5. Authentication middleware + protected routes
6. Not found handler
7. Error handler (paling akhir)

### Error Handling

1. Selalu gunakan `asyncErrorWrapper` untuk async handlers
2. Throw `ErrorAplikasi` untuk expected errors
3. Let unhandled errors bubble up ke error handler
4. Jangan catch errors di controller kecuali untuk specific handling

### Authorization

1. Selalu gunakan `autentikasiMiddleware` sebelum `otorisasiMiddleware`
2. Gunakan shortcut middleware untuk readability
3. Define role permissions di satu tempat untuk consistency

### Testing

1. Test middleware secara isolated dengan mock req/res/next
2. Test error scenarios (missing token, invalid token, wrong role)
3. Test happy path (valid token, correct role)
