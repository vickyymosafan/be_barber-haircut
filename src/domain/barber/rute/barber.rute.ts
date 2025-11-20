import { Router } from 'express';
import {
  asyncErrorWrapper,
  autentikasiMiddleware,
  adminOnlyMiddleware,
  validasiDto,
} from '@infrastruktur/middleware';
import { RepositoriBarber } from '../repositori';
import { ServiceBarber } from '../service';
import { ControllerBarber } from '../controller';
import { BuatBarberDto, PerbaruiBarberDto } from '../dto';

/**
 * Setup routes untuk domain Barber
 * Alasan: Centralized routing configuration
 */
export function setupRuteBarber(): Router {
  const router = Router();

  // Initialize dependencies
  // Alasan: Dependency injection pattern untuk testability
  const repositori = new RepositoriBarber();
  const service = new ServiceBarber(repositori);
  const controller = new ControllerBarber(service);

  /**
   * GET /api/barber
   * Mendapatkan daftar barber aktif
   * Public endpoint - tidak perlu autentikasi
   */
  router.get('/', asyncErrorWrapper(controller.dapatkanBarberAktif.bind(controller)));

  return router;
}

/**
 * Setup routes untuk admin barber management
 * Alasan: Memisahkan admin routes untuk clarity
 */
export function setupRuteAdminBarber(): Router {
  const router = Router();

  // Initialize dependencies
  const repositori = new RepositoriBarber();
  const service = new ServiceBarber(repositori);
  const controller = new ControllerBarber(service);

  /**
   * POST /api/admin/barber
   * Membuat barber baru
   * Admin only endpoint
   */
  router.post(
    '/',
    autentikasiMiddleware,
    adminOnlyMiddleware,
    validasiDto(BuatBarberDto),
    asyncErrorWrapper(controller.buatBarber.bind(controller))
  );

  /**
   * GET /api/admin/barber
   * Mendapatkan semua barber (termasuk yang tidak aktif)
   * Admin only endpoint
   */
  router.get(
    '/',
    autentikasiMiddleware,
    adminOnlyMiddleware,
    asyncErrorWrapper(controller.dapatkanSemuaBarber.bind(controller))
  );

  /**
   * GET /api/admin/barber/:id
   * Mendapatkan detail barber
   * Admin only endpoint
   */
  router.get(
    '/:id',
    autentikasiMiddleware,
    adminOnlyMiddleware,
    asyncErrorWrapper(controller.dapatkanBarberById.bind(controller))
  );

  /**
   * PUT /api/admin/barber/:id
   * Memperbarui barber
   * Admin only endpoint
   */
  router.put(
    '/:id',
    autentikasiMiddleware,
    adminOnlyMiddleware,
    validasiDto(PerbaruiBarberDto),
    asyncErrorWrapper(controller.perbaruiBarber.bind(controller))
  );

  /**
   * DELETE /api/admin/barber/:id
   * Menghapus barber
   * Admin only endpoint
   */
  router.delete(
    '/:id',
    autentikasiMiddleware,
    adminOnlyMiddleware,
    asyncErrorWrapper(controller.hapusBarber.bind(controller))
  );

  return router;
}
