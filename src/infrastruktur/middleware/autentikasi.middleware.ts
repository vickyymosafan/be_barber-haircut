import { Response, NextFunction } from 'express';
import { JwtUtil, ErrorFactory } from '@infrastruktur/util';
import { AuthenticatedRequest } from './types';

/**
 * Middleware untuk autentikasi menggunakan JWT token
 * Alasan: Memverifikasi bahwa request memiliki token yang valid
 */
export function autentikasiMiddleware(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  try {
    // Extract token dari Authorization header
    const authHeader = req.headers.authorization;
    const token = JwtUtil.extractTokenFromHeader(authHeader);

    // Jika token tidak ditemukan, throw error
    if (!token) {
      throw ErrorFactory.tokenTidakDitemukan();
    }

    // Verify token dan decode payload
    const decoded = JwtUtil.verifikasiToken(token);

    // Attach user data ke request object
    // Alasan: Agar controller bisa akses user data tanpa decode ulang
    req.user = decoded;

    // Lanjutkan ke next middleware atau route handler
    next();
  } catch (error) {
    // Pass error ke error handler middleware
    next(error);
  }
}

/**
 * Optional middleware untuk autentikasi
 * Tidak throw error jika token tidak ada, tapi tetap verify jika ada
 * Alasan: Untuk endpoint yang bisa diakses dengan atau tanpa autentikasi
 */
export function autentikasiOptionalMiddleware(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;
    const token = JwtUtil.extractTokenFromHeader(authHeader);

    // Jika token ada, verify dan attach user data
    if (token) {
      const decoded = JwtUtil.verifikasiToken(token);
      req.user = decoded;
    }

    // Lanjutkan tanpa error meskipun token tidak ada
    next();
  } catch (error) {
    // Jika token invalid, pass error ke error handler
    next(error);
  }
}
