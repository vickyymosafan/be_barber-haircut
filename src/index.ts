import 'reflect-metadata';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { dapatkanKoneksiDatabase } from '@infrastruktur/database';
import { errorHandlerMiddleware } from '@infrastruktur/middleware';
import { config } from '@konfigurasi/environment';

// Import route setup functions
import { setupRutePengguna } from '@domain/pengguna/rute';
import { setupRuteBarber, setupRuteAdminBarber } from '@domain/barber/rute';
import { setupRuteLayanan, setupRuteAdminLayanan } from '@domain/layanan/rute';
import { setupRuteBooking, setupRuteAdminBooking } from '@domain/booking/rute';
import { setupRutePembayaran } from '@domain/pembayaran/rute';
import { setupRuteInvoice } from '@domain/invoice/rute';

/**
 * Create Express application
 * Alasan: Main application setup untuk serverless deployment
 */
const app: Application = express();

/**
 * Middleware Setup
 * Alasan: Configure middleware untuk security, parsing, dan error handling
 */

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true,
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Database Connection Middleware
 * Alasan: Initialize database connection on first request (serverless-friendly)
 */
app.use(async (_req: Request, _res: Response, next) => {
  try {
    await dapatkanKoneksiDatabase();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    next(error);
  }
});

/**
 * Root Endpoint
 * Alasan: Informasi dasar API
 */
app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'Barber Haircut API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      barber: '/api/barber',
      layanan: '/api/layanan',
      booking: '/api/booking',
      pembayaran: '/api/pembayaran',
      invoice: '/api/invoice',
      admin: '/api/admin/*',
    },
  });
});

/**
 * Health Check Endpoint
 * Alasan: Untuk monitoring dan health checks
 */
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.app.nodeEnv,
  });
});

/**
 * API Routes Registration
 * Alasan: Register semua domain routes
 */

// Authentication & User routes
app.use('/api/auth', setupRutePengguna());

// Barber routes
app.use('/api/barber', setupRuteBarber());
app.use('/api/admin/barber', setupRuteAdminBarber());

// Layanan routes
app.use('/api/layanan', setupRuteLayanan());
app.use('/api/admin/layanan', setupRuteAdminLayanan());

// Booking routes
app.use('/api/booking', setupRuteBooking());
app.use('/api/admin/booking', setupRuteAdminBooking());

// Pembayaran routes
app.use('/api/pembayaran', setupRutePembayaran());

// Invoice routes
app.use('/api/invoice', setupRuteInvoice());

/**
 * 404 Handler
 * Alasan: Handle routes yang tidak ditemukan
 */
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    pesan: 'Endpoint tidak ditemukan',
  });
});

/**
 * Global Error Handler
 * Alasan: Catch semua errors dan return consistent response
 */
app.use(errorHandlerMiddleware);

/**
 * Export app untuk Vercel serverless
 * Alasan: Vercel membutuhkan export default untuk serverless functions
 */
export default app;

/**
 * Local Development Server
 * Alasan: Conditional listen hanya untuk local development
 */
if (config.app.nodeEnv === 'development') {
  const PORT = config.app.port || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${config.app.nodeEnv}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  });
}
