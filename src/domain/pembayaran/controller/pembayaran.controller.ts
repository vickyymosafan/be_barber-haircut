import { Response } from 'express';
import { ResponseBuilder } from '@infrastruktur/util';
import { AuthenticatedRequest } from '@infrastruktur/middleware';
import { ServicePembayaran } from '../service';
import { ProsesPembayaranDto } from '../dto';

/**
 * Controller Pembayaran
 * Alasan: Menangani HTTP requests untuk domain Pembayaran
 */
export class ControllerPembayaran {
  constructor(private service: ServicePembayaran) {}

  /**
   * Handler untuk memproses pembayaran (authenticated)
   * POST /api/pembayaran
   */
  async prosesPembayaran(req: AuthenticatedRequest, res: Response): Promise<void> {
    const dto = req.body as ProsesPembayaranDto;
    const penggunaId = req.user!.id;

    const hasil = await this.service.prosesPembayaran(dto, penggunaId);
    res.status(201).json(ResponseBuilder.created(hasil.pembayaran, hasil.pesan));
  }
}
