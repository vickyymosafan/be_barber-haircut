import { Layanan } from '../entitas/layanan.entitas';

/**
 * Interface Repository Layanan
 * Alasan: Abstraksi untuk data access layer, memudahkan testing dan maintainability
 */
export interface IRepositoriLayanan {
  /**
   * Membuat layanan baru
   * @param data - Data layanan baru
   * @returns Layanan yang telah dibuat
   */
  buatLayanan(data: Partial<Layanan>): Promise<Layanan>;

  /**
   * Mendapatkan semua layanan
   * @returns Array semua layanan
   */
  dapatkanSemuaLayanan(): Promise<Layanan[]>;

  /**
   * Mencari layanan berdasarkan ID
   * @param id - ID layanan
   * @returns Layanan atau null jika tidak ditemukan
   */
  dapatkanLayananById(id: string): Promise<Layanan | null>;

  /**
   * Memperbarui data layanan
   * @param id - ID layanan
   * @param data - Data yang akan diupdate
   * @returns Layanan yang telah diupdate
   */
  perbaruiLayanan(id: string, data: Partial<Layanan>): Promise<Layanan>;

  /**
   * Menghapus layanan
   * @param id - ID layanan
   */
  hapusLayanan(id: string): Promise<void>;
}
