import 'dotenv/config';

/**
 * Konfigurasi environment untuk aplikasi
 * Menggunakan dotenv untuk load environment variables dari file .env
 */
export const config = {
  database: {
    url: process.env.DATABASE_URL || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET || '',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
  },
  storage: {
    url: process.env.CLOUD_STORAGE_URL || '',
    apiKey: process.env.CLOUD_STORAGE_API_KEY || '',
  },
};

/**
 * Validasi environment variables yang required
 * Throw error jika ada variable yang missing
 * Alasan: Mencegah aplikasi berjalan dengan konfigurasi yang tidak lengkap
 */
export function validateConfig(): void {
  const required = ['DATABASE_URL', 'JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please check your .env file or environment configuration.'
    );
  }

  // Validasi format DATABASE_URL
  if (config.database.url && !config.database.url.startsWith('postgresql://')) {
    throw new Error('DATABASE_URL must be a valid PostgreSQL connection string');
  }

  // Validasi JWT_SECRET tidak boleh terlalu pendek
  if (config.jwt.secret && config.jwt.secret.length < 32) {
    console.warn('WARNING: JWT_SECRET should be at least 32 characters long for better security');
  }
}
