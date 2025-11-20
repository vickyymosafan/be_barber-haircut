import { Barber } from '../entitas/barber.entitas';

/**
 * Interface Repository Barber
 * Alasan: Abstraksi untuk data access layer, memudahkan testing dan maintainability
 */
export interface IRepositoriBarber {
  /**
   * Membuat barber baru
   * @param data - Data barber baru
   * @returns Barber yang telah dibuat
   */
  buatBarber(data: Partial<Barber>): Promise<Barber>;

  /**
   * Mendapatkan semua barber (termasuk yang tidak aktif)
   * @returns Array semua barber
   */
  dapatkanSemuaBarber(): Promise<Barber[]>;

  /**
   * Mendapatkan barber yang aktif saja
   * @returns Array barber dengan status aktif
   */
  dapatkanBarberAktif(): Promise<Barber[]>;

  /**
   * Mencari barber berdasarkan ID
   * @param id - ID barber
   * @returns Barber atau null jika tidak ditemukan
   */
  dapatkanBarberById(id: string): Promise<Barber | null>;

  /**
   * Memperbarui data barber
   * @param id - ID barber
   * @param data - Data yang akan diupdate
   * @returns Barber yang telah diupdate
   */
  perbaruiBarber(id: string, data: Partial<Barber>): Promise<Barber>;

  /**
   * Menghapus barber
   * @param id - ID barber
   */
  hapusBarber(id: string): Promise<void>;
}
