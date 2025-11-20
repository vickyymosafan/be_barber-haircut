import { Request } from 'express';
import { PayloadToken } from '@infrastruktur/util';

/**
 * Custom Request interface dengan user data
 * Alasan: Untuk type safety saat mengakses req.user setelah autentikasi
 */
export interface AuthenticatedRequest extends Request {
  user?: PayloadToken;
}
