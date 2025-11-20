import { Response, NextFunction, RequestHandler } from 'express';
import { ErrorFactory } from '@infrastruktur/util';
import { AuthenticatedRequest } from './types';

/**
 * Middleware untuk otorisasi role-based
 * Alasan: Memastikan hanya user dengan role tertentu yang bisa akses endpoint
 *
 * @param roleYangDiizinkan - Array role yang diizinkan akses
 * @returns Middleware function
 *
 * @example
 * // Hanya admin yang bisa akses
 * router.get('/admin/users', otorisasiMiddleware(['admin']), controller);
 *
 * // Admin dan pelanggan bisa akses
 * router.get('/profile', otorisasiMiddleware(['admin', 'pelanggan']), controller);
 */
export function otorisasiMiddleware(roleYangDiizinkan: string[]): RequestHandler {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    try {
      // Check apakah user sudah terautentikasi
      // Alasan: Otorisasi hanya bisa dilakukan setelah autentikasi
      if (!req.user) {
        throw ErrorFactory.tokenTidakDitemukan();
      }

      // Check apakah role user ada dalam daftar role yang diizinkan
      const userRole = req.user.role;
      if (!roleYangDiizinkan.includes(userRole)) {
        throw ErrorFactory.aksesDitolak(
          `Akses ditolak - role '${userRole}' tidak diizinkan untuk endpoint ini`
        );
      }

      // Role sesuai, lanjutkan ke next middleware atau route handler
      next();
    } catch (error) {
      // Pass error ke error handler middleware
      next(error);
    }
  };
}

/**
 * Middleware khusus untuk admin only
 * Alasan: Shortcut untuk endpoint yang hanya bisa diakses admin
 *
 * @example
 * router.delete('/users/:id', adminOnlyMiddleware, controller);
 */
export const adminOnlyMiddleware = otorisasiMiddleware(['admin']);

/**
 * Middleware khusus untuk pelanggan only
 * Alasan: Shortcut untuk endpoint yang hanya bisa diakses pelanggan
 *
 * @example
 * router.get('/my-bookings', pelangganOnlyMiddleware, controller);
 */
export const pelangganOnlyMiddleware = otorisasiMiddleware(['pelanggan']);

/**
 * Middleware untuk semua authenticated users (admin dan pelanggan)
 * Alasan: Untuk endpoint yang bisa diakses semua user yang login
 *
 * @example
 * router.get('/profile', authenticatedOnlyMiddleware, controller);
 */
export const authenticatedOnlyMiddleware = otorisasiMiddleware(['admin', 'pelanggan']);
