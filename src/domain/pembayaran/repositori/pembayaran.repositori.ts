import { Repository } from 'typeorm';
import { dapatkanKoneksiDatabase } from '@infrastruktur/database';
import { ErrorFactory } from '@infrastruktur/util';
import { Pembayaran } from '../entitas/pembayaran.entitas';
import { IRepositoriPembayaran } from './pembayaran.repositori.interface';

/**
 * Implementasi Repository Pembayaran
 * Alasan: Menangani semua operasi database untuk entitas Pembayaran
 */
export class RepositoriPembayaran implements IRepositoriPembayaran {
  private repository: Repository<Pembayaran> | null = null;

  /**
   * Get TypeORM repository instance
   * Alasan: Lazy loading repository untuk serverless compatibility
   */
  private async getRepository(): Promise<Repository<Pembayaran>> {
    if (!this.repository) {
      const dataSource = await dapatkanKoneksiDatabase();
      this.repository = dataSource.getRepository(Pembayaran);
    }
    return this.repository;
  }

  /**
   * Membuat pembayaran baru
   */
  async buatPembayaran(data: Partial<Pembayaran>): Promise<Pembayaran> {
    try {
      const repo = await this.getRepository();
      const pembayaran = repo.create(data);
      return await repo.save(pembayaran);
    } catch (error) {
      // Check untuk unique constraint violation (booking sudah punya pembayaran)
      if (error instanceof Error && error.message.includes('duplicate key')) {
        throw ErrorFactory.validasiGagal('Booking ini sudah memiliki pembayaran');
      }
      throw ErrorFactory.databaseError('Gagal membuat pembayaran', error);
    }
  }

  /**
   * Mencari pembayaran berdasarkan booking ID
   */
  async dapatkanPembayaranByBookingId(bookingId: string): Promise<Pembayaran | null> {
    try {
      const repo = await this.getRepository();
      return await repo.findOne({
        where: { bookingId },
        relations: ['booking'],
      });
    } catch (error) {
      throw ErrorFactory.databaseError('Gagal mencari pembayaran', error);
    }
  }

  /**
   * Mencari pembayaran berdasarkan ID
   */
  async dapatkanPembayaranById(id: string): Promise<Pembayaran | null> {
    try {
      const repo = await this.getRepository();
      return await repo.findOne({
        where: { id },
        relations: ['booking'],
      });
    } catch (error) {
      throw ErrorFactory.databaseError('Gagal mencari pembayaran', error);
    }
  }
}
