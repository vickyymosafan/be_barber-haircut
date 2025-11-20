import { Request, Response } from 'express';
import { ResponseBuilder } from '@infrastruktur/util';
import { ServiceLayanan } from '../service';
import { BuatLayananDto, PerbaruiLayananDto } from '../dto';

/**
 * Controller Layanan
 * Alasan: Menangani HTTP requests untuk domain Layanan
 */
export class ControllerLayanan {
  constructor(private service: ServiceLayanan) {}

  /**
   * Handler untuk mendapatkan daftar semua layanan (public endpoint)
   * GET /api/layanan
   */
  async dapatkanSemuaLayanan(_req: Request, res: Response): Promise<void> {
    const layanan = await this.service.dapatkanSemuaLayanan();
    res.json(ResponseBuilder.sukses(layanan, 'Daftar layanan berhasil diambil'));
  }

  /**
   * Handler untuk membuat layanan baru (admin only)
   * POST /api/admin/layanan
   */
  async buatLayanan(req: Request, res: Response): Promise<void> {
    const dto = req.body as BuatLayananDto;
    const layanan = await this.service.buatLayanan(dto);
    res.status(201).json(ResponseBuilder.created(layanan, 'Layanan berhasil dibuat'));
  }

  /**
   * Handler untuk memperbarui layanan (admin only)
   * PUT /api/admin/layanan/:id
   */
  async perbaruiLayanan(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const dto = req.body as PerbaruiLayananDto;
    const layanan = await this.service.perbaruiLayanan(id, dto);
    res.json(ResponseBuilder.updated(layanan, 'Layanan berhasil diperbarui'));
  }

  /**
   * Handler untuk menghapus layanan (admin only)
   * DELETE /api/admin/layanan/:id
   */
  async hapusLayanan(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.service.hapusLayanan(id);
    res.json(ResponseBuilder.deleted('Layanan berhasil dihapus'));
  }
}
