import { IRepositoriLayanan } from '../repositori';
import { BuatLayananDto, PerbaruiLayananDto } from '../dto';
import { Layanan } from '../entitas/layanan.entitas';

/**
 * Service Layanan
 * Alasan: Menangani business logic untuk domain Layanan
 */
export class ServiceLayanan {
  constructor(private repositori: IRepositoriLayanan) {}

  /**
   * Membuat layanan baru
   * @param dto - Data layanan baru
   * @returns Layanan yang telah dibuat
   */
  async buatLayanan(dto: BuatLayananDto): Promise<Layanan> {
    return await this.repositori.buatLayanan({
      namaLayanan: dto.namaLayanan,
      harga: dto.harga,
    });
  }

  /**
   * Mendapatkan semua layanan
   * @returns Array semua layanan
   */
  async dapatkanSemuaLayanan(): Promise<Layanan[]> {
    return await this.repositori.dapatkanSemuaLayanan();
  }

  /**
   * Mendapatkan detail layanan berdasarkan ID
   * @param id - ID layanan
   * @returns Layanan atau null jika tidak ditemukan
   */
  async dapatkanLayananById(id: string): Promise<Layanan | null> {
    return await this.repositori.dapatkanLayananById(id);
  }

  /**
   * Memperbarui data layanan
   * @param id - ID layanan
   * @param dto - Data yang akan diupdate
   * @returns Layanan yang telah diupdate
   */
  async perbaruiLayanan(id: string, dto: PerbaruiLayananDto): Promise<Layanan> {
    return await this.repositori.perbaruiLayanan(id, dto);
  }

  /**
   * Menghapus layanan
   * @param id - ID layanan
   */
  async hapusLayanan(id: string): Promise<void> {
    await this.repositori.hapusLayanan(id);
  }
}
