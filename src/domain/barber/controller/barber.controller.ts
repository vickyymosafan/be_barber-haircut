import { Request, Response } from 'express';
import { ResponseBuilder } from '@infrastruktur/util';
import { ServiceBarber } from '../service';
import { BuatBarberDto, PerbaruiBarberDto } from '../dto';

/**
 * Controller Barber
 * Alasan: Menangani HTTP requests untuk domain Barber
 */
export class ControllerBarber {
  constructor(private service: ServiceBarber) {}

  /**
   * Handler untuk mendapatkan daftar barber aktif (public endpoint)
   * GET /api/barber
   */
  async dapatkanBarberAktif(_req: Request, res: Response): Promise<void> {
    const barbers = await this.service.dapatkanBarberUntukPelanggan();
    res.json(ResponseBuilder.sukses(barbers, 'Daftar barber berhasil diambil'));
  }

  /**
   * Handler untuk membuat barber baru (admin only)
   * POST /api/admin/barber
   */
  async buatBarber(req: Request, res: Response): Promise<void> {
    const dto = req.body as BuatBarberDto;
    const barber = await this.service.buatBarber(dto);
    res.status(201).json(ResponseBuilder.created(barber, 'Barber berhasil dibuat'));
  }

  /**
   * Handler untuk mendapatkan semua barber (admin only)
   * GET /api/admin/barber
   */
  async dapatkanSemuaBarber(_req: Request, res: Response): Promise<void> {
    const barbers = await this.service.dapatkanSemuaBarber();
    res.json(ResponseBuilder.sukses(barbers, 'Daftar semua barber berhasil diambil'));
  }

  /**
   * Handler untuk mendapatkan detail barber (admin only)
   * GET /api/admin/barber/:id
   */
  async dapatkanBarberById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const barber = await this.service.dapatkanBarberById(id);
    res.json(ResponseBuilder.sukses(barber, 'Detail barber berhasil diambil'));
  }

  /**
   * Handler untuk memperbarui barber (admin only)
   * PUT /api/admin/barber/:id
   */
  async perbaruiBarber(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const dto = req.body as PerbaruiBarberDto;
    const barber = await this.service.perbaruiBarber(id, dto);
    res.json(ResponseBuilder.updated(barber, 'Barber berhasil diperbarui'));
  }

  /**
   * Handler untuk menghapus barber (admin only)
   * DELETE /api/admin/barber/:id
   */
  async hapusBarber(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.service.hapusBarber(id);
    res.json(ResponseBuilder.deleted('Barber berhasil dihapus'));
  }
}
