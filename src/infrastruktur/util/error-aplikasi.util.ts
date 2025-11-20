/**
 * Custom Error class untuk aplikasi
 * Alasan: Menyediakan error handling yang konsisten dengan kode error dan status HTTP
 */
export class ErrorAplikasi extends Error {
  constructor(
    public kodeError: string,
    public pesanError: string,
    public statusHttp: number = 500,
    public detail?: any
  ) {
    super(pesanError);
    this.name = 'ErrorAplikasi';
    // Alasan: Memastikan stack trace tetap akurat
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error Codes Constants
 * Alasan: Centralized error codes untuk menghindari duplikasi dan typo
 */
export const ERROR_CODES = {
  // Authentication Errors
  AUTH_001: 'AUTH_001', // Token tidak valid atau expired
  AUTH_002: 'AUTH_002', // Token tidak ditemukan
  AUTH_003: 'AUTH_003', // Akses ditolak - role tidak sesuai
  AUTH_004: 'AUTH_004', // Email atau password salah

  // Booking Errors
  BOOKING_001: 'BOOKING_001', // Slot waktu tidak tersedia
  BOOKING_002: 'BOOKING_002', // Jam booking tidak valid (harus 9-23)
  BOOKING_003: 'BOOKING_003', // Booking tidak ditemukan
  BOOKING_004: 'BOOKING_004', // Status booking tidak dapat diubah

  // Payment Errors
  PAYMENT_001: 'PAYMENT_001', // Pembayaran gagal
  PAYMENT_002: 'PAYMENT_002', // Pembayaran tidak ditemukan

  // Invoice Errors
  INVOICE_001: 'INVOICE_001', // Akses invoice ditolak
  INVOICE_002: 'INVOICE_002', // Invoice tidak ditemukan

  // Validation Errors
  VALIDATION_001: 'VALIDATION_001', // Data input tidak valid

  // Database Errors
  DATABASE_001: 'DATABASE_001', // Error koneksi database

  // Internal Errors
  INTERNAL_001: 'INTERNAL_001', // Internal server error
} as const;

/**
 * Helper functions untuk create common errors
 * Alasan: Menghindari duplikasi code saat throw error
 */
export class ErrorFactory {
  static tokenTidakValid(detail?: any): ErrorAplikasi {
    return new ErrorAplikasi(ERROR_CODES.AUTH_001, 'Token tidak valid atau expired', 401, detail);
  }

  static tokenTidakDitemukan(): ErrorAplikasi {
    return new ErrorAplikasi(ERROR_CODES.AUTH_002, 'Token tidak ditemukan', 401);
  }

  static aksesDitolak(pesan = 'Akses ditolak - role tidak sesuai'): ErrorAplikasi {
    return new ErrorAplikasi(ERROR_CODES.AUTH_003, pesan, 403);
  }

  static kredensialSalah(): ErrorAplikasi {
    return new ErrorAplikasi(ERROR_CODES.AUTH_004, 'Email atau password salah', 401);
  }

  static slotTidakTersedia(): ErrorAplikasi {
    return new ErrorAplikasi(ERROR_CODES.BOOKING_001, 'Slot waktu tidak tersedia', 400);
  }

  static jamTidakValid(): ErrorAplikasi {
    return new ErrorAplikasi(ERROR_CODES.BOOKING_002, 'Jam booking tidak valid (harus 9-23)', 400);
  }

  static bookingTidakDitemukan(): ErrorAplikasi {
    return new ErrorAplikasi(ERROR_CODES.BOOKING_003, 'Booking tidak ditemukan', 404);
  }

  static statusTidakDapatDiubah(): ErrorAplikasi {
    return new ErrorAplikasi(ERROR_CODES.BOOKING_004, 'Status booking tidak dapat diubah', 400);
  }

  static pembayaranGagal(detail?: any): ErrorAplikasi {
    return new ErrorAplikasi(ERROR_CODES.PAYMENT_001, 'Pembayaran gagal', 400, detail);
  }

  static pembayaranTidakDitemukan(): ErrorAplikasi {
    return new ErrorAplikasi(ERROR_CODES.PAYMENT_002, 'Pembayaran tidak ditemukan', 404);
  }

  static aksesInvoiceDitolak(): ErrorAplikasi {
    return new ErrorAplikasi(ERROR_CODES.INVOICE_001, 'Akses invoice ditolak', 403);
  }

  static invoiceTidakDitemukan(): ErrorAplikasi {
    return new ErrorAplikasi(ERROR_CODES.INVOICE_002, 'Invoice tidak ditemukan', 404);
  }

  static validasiGagal(pesan: string, detail?: any): ErrorAplikasi {
    return new ErrorAplikasi(ERROR_CODES.VALIDATION_001, pesan, 400, detail);
  }

  static databaseError(pesan = 'Error koneksi database', detail?: any): ErrorAplikasi {
    return new ErrorAplikasi(ERROR_CODES.DATABASE_001, pesan, 500, detail);
  }

  static internalError(pesan = 'Terjadi kesalahan pada server', detail?: any): ErrorAplikasi {
    return new ErrorAplikasi(ERROR_CODES.INTERNAL_001, pesan, 500, detail);
  }
}
