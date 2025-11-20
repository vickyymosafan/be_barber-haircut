import { Router } from 'express';
import {
  asyncErrorWrapper,
  autentikasiMiddleware,
  adminOnlyMiddleware,
  validasiDto,
} from '@infrastruktur/middleware';
import { RepositoriLayanan } from '../repositori';
import { ServiceLayanan } from '../service';
import { ControllerLayanan } from '../controller';
import { BuatLayananDto, PerbaruiLayananDto } from '../dto';

/**
 * Setup routes untuk domain Layanan
 * Alasan: Centralized routing configuration
 */
export function setupRuteLayanan(): Router {
  const router = Router();

  // Initialize dependencies
  // Alasan: Dependency injection pattern untuk testability
  const repositori = new RepositoriLayanan();
  const service = new ServiceLayanan(repositori);
  const controller = new ControllerLayanan(service);

  /**
   * GET /api/layanan
   * Mendapatkan daftar semua layanan
   * Public endpoint - tidak perlu autentikasi
   */
  router.get('/', asyncErrorWrapper(controller.dapatkanSemuaLayanan.bind(controller)));

  return router;
}

/**
 * Setup routes untuk admin layanan management
 * Alasan: Memisahkan admin routes untuk clarity
 */
export function setupRuteAdminLayanan(): Router {
  const router = Router();

  // Initialize dependencies
  const repositori = new RepositoriLayanan();
  const service = new ServiceLayanan(repositori);
  const controller = new ControllerLayanan(service);

  /**
   * POST /api/admin/layanan
   * Membuat layanan baru
   * Admin only endpoint
   */
  router.post(
    '/',
    autentikasiMiddleware,
    adminOnlyMiddleware,
    validasiDto(BuatLayananDto),
    asyncErrorWrapper(controller.buatLayanan.bind(controller))
  );

  /**
   * PUT /api/admin/layanan/:id
   * Memperbarui layanan
   * Admin only endpoint
   */
  router.put(
    '/:id',
    autentikasiMiddleware,
    adminOnlyMiddleware,
    validasiDto(PerbaruiLayananDto),
    asyncErrorWrapper(controller.perbaruiLayanan.bind(controller))
  );

  /**
   * DELETE /api/admin/layanan/:id
   * Menghapus layanan
   * Admin only endpoint
   */
  router.delete(
    '/:id',
    autentikasiMiddleware,
    adminOnlyMiddleware,
    asyncErrorWrapper(controller.hapusLayanan.bind(controller))
  );

  return router;
}
