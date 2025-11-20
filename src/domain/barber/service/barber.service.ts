import { IRepositoriBarber } from '../repositori';
import { BuatBarberDto, PerbaruiBarberDto } from '../dto';
import { Barber } from '../entitas/barber.entitas';

/**
 * Service Barber
 * Alasan: Menangani business logic untuk domain Barber
 */
export class ServiceBarber {
  constructor(private repositori: IRepositoriBarber) {}

  /**
   * Membuat barber baru
   * @param dto - Data barber baru
   * @returns Barber yang telah dibuat
   */
  async buatBarber(dto: BuatBarberDto): Promise<Barber> {
    return await this.repositori.buatBarber({
      nama: dto.nama,
      fotoProfilUrl: dto.fotoProfilUrl || '',
      rating: dto.rating ?? 0,
      statusAktif: dto.statusAktif ?? true,
    });
  }

  /**
   * Mendapatkan semua barber (untuk admin)
   * @returns Array semua barber
   */
  async dapatkanSemuaBarber(): Promise<Barber[]> {
    return await this.repositori.dapatkanSemuaBarber();
  }

  /**
   * Mendapatkan barber aktif (untuk pelanggan)
   * Alasan: Pelanggan hanya boleh melihat barber yang aktif
   * @returns Array barber dengan status aktif
   */
  async dapatkanBarberUntukPelanggan(): Promise<Barber[]> {
    return await this.repositori.dapatkanBarberAktif();
  }

  /**
   * Mendapatkan detail barber berdasarkan ID
   * @param id - ID barber
   * @returns Barber atau null jika tidak ditemukan
   */
  async dapatkanBarberById(id: string): Promise<Barber | null> {
    return await this.repositori.dapatkanBarberById(id);
  }

  /**
   * Memperbarui data barber
   * @param id - ID barber
   * @param dto - Data yang akan diupdate
   * @returns Barber yang telah diupdate
   */
  async perbaruiBarber(id: string, dto: PerbaruiBarberDto): Promise<Barber> {
    return await this.repositori.perbaruiBarber(id, dto);
  }

  /**
   * Menghapus barber
   * @param id - ID barber
   */
  async hapusBarber(id: string): Promise<void> {
    await this.repositori.hapusBarber(id);
  }
}
