import { Repository } from 'typeorm';
import { dapatkanKoneksiDatabase } from '@infrastruktur/database';
import { ErrorFactory } from '@infrastruktur/util';
import { Layanan } from '../entitas/layanan.entitas';
import { IRepositoriLayanan } from './layanan.repositori.interface';

/**
 * Implementasi Repository Layanan
 * Alasan: Menangani semua operasi database untuk entitas Layanan
 */
export class RepositoriLayanan implements IRepositoriLayanan {
  private repository: Repository<Layanan> | null = null;

  /**
   * Get TypeORM repository instance
   * Alasan: Lazy loading repository untuk serverless compatibility
   */
  private async getRepository(): Promise<Repository<Layanan>> {
    if (!this.repository) {
      const dataSource = await dapatkanKoneksiDatabase();
      this.repository = dataSource.getRepository(Layanan);
    }
    return this.repository;
  }

  /**
   * Membuat layanan baru
   */
  async buatLayanan(data: Partial<Layanan>): Promise<Layanan> {
    try {
      const repo = await this.getRepository();
      const layanan = repo.create(data);
      return await repo.save(layanan);
    } catch (error) {
      throw ErrorFactory.databaseError('Gagal membuat layanan', error);
    }
  }

  /**
   * Mendapatkan semua layanan
   */
  async dapatkanSemuaLayanan(): Promise<Layanan[]> {
    try {
      const repo = await this.getRepository();
      return await repo.find({
        order: {
          createdAt: 'DESC',
        },
      });
    } catch (error) {
      throw ErrorFactory.databaseError('Gagal mengambil data layanan', error);
    }
  }

  /**
   * Mencari layanan berdasarkan ID
   */
  async dapatkanLayananById(id: string): Promise<Layanan | null> {
    try {
      const repo = await this.getRepository();
      return await repo.findOne({ where: { id } });
    } catch (error) {
      throw ErrorFactory.databaseError('Gagal mencari layanan', error);
    }
  }

  /**
   * Memperbarui data layanan
   */
  async perbaruiLayanan(id: string, data: Partial<Layanan>): Promise<Layanan> {
    try {
      const repo = await this.getRepository();

      // Check apakah layanan exists
      const layanan = await this.dapatkanLayananById(id);
      if (!layanan) {
        throw ErrorFactory.validasiGagal('Layanan tidak ditemukan');
      }

      // Update data
      await repo.update(id, data);

      // Return updated layanan
      const updated = await this.dapatkanLayananById(id);
      if (!updated) {
        throw ErrorFactory.databaseError('Gagal mengambil data layanan setelah update');
      }

      return updated;
    } catch (error) {
      if (error instanceof Error && error.name === 'ErrorAplikasi') {
        throw error;
      }
      throw ErrorFactory.databaseError('Gagal memperbarui layanan', error);
    }
  }

  /**
   * Menghapus layanan
   */
  async hapusLayanan(id: string): Promise<void> {
    try {
      const repo = await this.getRepository();

      // Check apakah layanan exists
      const layanan = await this.dapatkanLayananById(id);
      if (!layanan) {
        throw ErrorFactory.validasiGagal('Layanan tidak ditemukan');
      }

      // Delete layanan
      await repo.delete(id);
    } catch (error) {
      if (error instanceof Error && error.name === 'ErrorAplikasi') {
        throw error;
      }
      throw ErrorFactory.databaseError('Gagal menghapus layanan', error);
    }
  }
}
