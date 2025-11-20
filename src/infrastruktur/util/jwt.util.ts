import * as jwt from 'jsonwebtoken';
import { config } from '@konfigurasi/environment';
import { ErrorFactory } from './error-aplikasi.util';

/**
 * JWT Payload Interface
 * Alasan: Type safety untuk JWT payload structure
 */
export interface PayloadToken {
  id: string;
  email: string;
  role: 'pelanggan' | 'admin';
  iat?: number; // Issued at
  exp?: number; // Expiration time
}

/**
 * JWT Utility untuk token generation dan verification
 * Alasan: Centralized JWT operations untuk consistency dan security
 */
export class JwtUtil {
  /**
   * Generate JWT token
   * @param payload - Data yang akan di-encode dalam token
   * @returns JWT token string
   * Alasan: Untuk autentikasi stateless
   */
  static generateToken(payload: Omit<PayloadToken, 'iat' | 'exp'>): string {
    try {
      const token = jwt.sign(
        payload,
        config.jwt.secret,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { expiresIn: config.jwt.expiresIn } as any
      );
      return token;
    } catch (error) {
      throw ErrorFactory.internalError('Gagal generate JWT token', error);
    }
  }

  /**
   * Verifikasi dan decode JWT token
   * @param token - JWT token string
   * @returns Decoded payload
   * @throws ErrorAplikasi jika token invalid atau expired
   * Alasan: Untuk validasi autentikasi
   */
  static verifikasiToken(token: string): PayloadToken {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as PayloadToken;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw ErrorFactory.tokenTidakValid({ reason: 'Token expired' });
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw ErrorFactory.tokenTidakValid({ reason: 'Token invalid' });
      }
      throw ErrorFactory.tokenTidakValid({ reason: 'Token verification failed' });
    }
  }

  /**
   * Decode token tanpa verifikasi
   * @param token - JWT token string
   * @returns Decoded payload atau null jika gagal
   * Alasan: Untuk inspect token tanpa validasi (debugging, logging)
   * WARNING: Jangan gunakan untuk autentikasi!
   */
  static decodeToken(token: string): PayloadToken | null {
    try {
      const decoded = jwt.decode(token) as PayloadToken;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * Check apakah token sudah expired
   * @param token - JWT token string
   * @returns True jika expired, false jika masih valid
   * Alasan: Untuk check expiration tanpa throw error
   */
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) {
        return true;
      }
      // exp dalam seconds, Date.now() dalam milliseconds
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  }

  /**
   * Extract token dari Authorization header
   * @param authHeader - Authorization header value
   * @returns Token string atau null
   * Alasan: Untuk extract token dari "Bearer <token>" format
   */
  static extractTokenFromHeader(authHeader?: string): string | null {
    if (!authHeader) {
      return null;
    }

    // Format: "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];
  }

  /**
   * Generate refresh token dengan expiration lebih lama
   * @param payload - Data yang akan di-encode
   * @param expiresIn - Custom expiration (default: 7 days)
   * @returns JWT refresh token string
   * Alasan: Untuk implement refresh token mechanism
   */
  static generateRefreshToken(
    payload: Omit<PayloadToken, 'iat' | 'exp'>,
    expiresIn = '7d'
  ): string {
    try {
      const token = jwt.sign(
        payload,
        config.jwt.secret,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { expiresIn } as any
      );
      return token;
    } catch (error) {
      throw ErrorFactory.internalError('Gagal generate refresh token', error);
    }
  }
}
