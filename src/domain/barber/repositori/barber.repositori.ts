import { Repository } from 'typeorm';
import { dapatkanKoneksiDatabase } from '@infrastruktur/database';
import { ErrorFactory } from '@infrastruktur/util';
import { Barber } from '../entitas/barber.entitas';
import { IRepositoriBarber } from './barber.repositori.interface';

/**
 * Implementasi Repository Barber
 * Alasan: Menangani semua operasi database untuk entitas Barber
 */
export class RepositoriBarber implements IRepositoriBarber {
  private repository: Repository<Barber> | null = null;

  /**
   * Get TypeORM repository instance
   * Alasan: Lazy loading repository untuk serverless compatibility
   */
  private async getRepository(): Promise<Repository<Barber>> {
    if (!this.repository) {
      const dataSource = await dapatkanKoneksiDatabase();
      this.repository = dataSource.getRepository(Barber);
    }
    return this.repository;
  }

  /**
   * Membuat barber baru
   */
  async buatBarber(data: Partial<Barber>): Promise<Barber> {
    try {
      const repo = await this.getRepository();
      const barber = repo.create(data);
      return await repo.save(barber);
    } catch (error) {
      throw ErrorFactory.databaseError('Gagal membuat barber', error);
    }
  }

  /**
   * Mendapatkan semua barber (termasuk yang tidak aktif)
   */
  async dapatkanSemuaBarber(): Promise<Barber[]> {
    try {
      const repo = await this.getRepository();
      return await repo.find({
        order: {
          createdAt: 'DESC',
        },
      });
    } catch (error) {
      throw ErrorFactory.databaseError('Gagal mengambil data barber', error);
    }
  }

  /**
   * Mendapatkan barber yang aktif saja
   */
  async dapatkanBarberAktif(): Promise<Barber[]> {
    try {
      const repo = await this.getRepository();
      return await repo.find({
        where: {
          statusAktif: true,
        },
        order: {
          rating: 'DESC',
          createdAt: 'DESC',
        },
      });
    } catch (error) {
      throw ErrorFactory.databaseError('Gagal mengambil data barber aktif', error);
    }
  }

  /**
   * Mencari barber berdasarkan ID
   */
  async dapatkanBarberById(id: string): Promise<Barber | null> {
    try {
      const repo = await this.getRepository();
      return await repo.findOne({ where: { id } });
    } catch (error) {
      throw ErrorFactory.databaseError('Gagal mencari barber', error);
    }
  }

  /**
   * Memperbarui data barber
   */
  async perbaruiBarber(id: string, data: Partial<Barber>): Promise<Barber> {
    try {
      const repo = await this.getRepository();

      // Check apakah barber exists
      const barber = await this.dapatkanBarberById(id);
      if (!barber) {
        throw ErrorFactory.validasiGagal('Barber tidak ditemukan');
      }

      // Update data
      await repo.update(id, data);

      // Return updated barber
      const updated = await this.dapatkanBarberById(id);
      if (!updated) {
        throw ErrorFactory.databaseError('Gagal mengambil data barber setelah update');
      }

      return updated;
    } catch (error) {
      if (error instanceof Error && error.name === 'ErrorAplikasi') {
        throw error;
      }
      throw ErrorFactory.databaseError('Gagal memperbarui barber', error);
    }
  }

  /**
   * Menghapus barber
   */
  async hapusBarber(id: string): Promise<void> {
    try {
      const repo = await this.getRepository();

      // Check apakah barber exists
      const barber = await this.dapatkanBarberById(id);
      if (!barber) {
        throw ErrorFactory.validasiGagal('Barber tidak ditemukan');
      }

      // Delete barber
      await repo.delete(id);
    } catch (error) {
      if (error instanceof Error && error.name === 'ErrorAplikasi') {
        throw error;
      }
      throw ErrorFactory.databaseError('Gagal menghapus barber', error);
    }
  }
}
