import { Pembayaran } from '../entitas/pembayaran.entitas';

/**
 * Interface Repository Pembayaran
 * Alasan: Abstraksi untuk data access layer, memudahkan testing dan maintainability
 */
export interface IRepositoriPembayaran {
  /**
   * Membuat pembayaran baru
   * @param data - Data pembayaran baru
   * @returns Pembayaran yang telah dibuat
   */
  buatPembayaran(data: Partial<Pembayaran>): Promise<Pembayaran>;

  /**
   * Mencari pembayaran berdasarkan booking ID
   * @param bookingId - ID booking
   * @returns Pembayaran atau null jika tidak ditemukan
   */
  dapatkanPembayaranByBookingId(bookingId: string): Promise<Pembayaran | null>;

  /**
   * Mencari pembayaran berdasarkan ID
   * @param id - ID pembayaran
   * @returns Pembayaran atau null jika tidak ditemukan
   */
  dapatkanPembayaranById(id: string): Promise<Pembayaran | null>;
}
