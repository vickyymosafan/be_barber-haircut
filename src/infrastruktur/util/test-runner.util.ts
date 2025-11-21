import { dapatkanKoneksiDatabase } from '@infrastruktur/database';
import { EnkripsiUtil } from '@infrastruktur/util';
import { Pengguna } from '@domain/pengguna/entitas/pengguna.entitas';

const BASE_URL = 'http://localhost:3000';

interface TestResult {
  endpoint: string;
  status: 'PASS' | 'FAIL';
  message: string;
}

export async function jalankanTestEndpoints(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  let adminToken = '';
  let userToken = '';
  let barberId = '';
  let layananId = '';
  let bookingId = '';

  async function logResult(endpoint: string, status: 'PASS' | 'FAIL', message: string) {
    results.push({ endpoint, status, message });
  }

  async function request(method: string, path: string, body?: any, token?: string) {
    try {
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${BASE_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json().catch(() => ({}));
      return { status: response.status, data };
    } catch (error) {
      return { status: 500, data: { error: String(error) } };
    }
  }

  async function seedAdmin() {
    try {
      const db = await dapatkanKoneksiDatabase();
      const repo = db.getRepository(Pengguna);
      const email = 'admin@barber.com';

      let admin = await repo.findOne({ where: { email } });
      if (!admin) {
        const passwordHash = await EnkripsiUtil.hashPassword('Admin1234');
        admin = repo.create({
          nama: 'Admin Barber',
          email,
          nomorTelepon: '081234567890',
          passwordHash,
          role: 'admin',
        });
        await repo.save(admin);
      }
    } catch (error) {
      console.error('Seed admin failed', error);
    }
  }

  await seedAdmin();

  // 1. Health Check
  const health = await request('GET', '/health');
  if (health.status === 200) logResult('GET /health', 'PASS', 'OK');
  else logResult('GET /health', 'FAIL', `Status ${health.status}`);

  // 2. Login Admin
  const loginAdmin = await request('POST', '/api/auth/login', {
    email: 'admin@barber.com',
    password: 'Admin1234',
  });

  const adminData = loginAdmin.data as any;
  if (loginAdmin.status === 200 && adminData.data?.token) {
    adminToken = adminData.data.token;
    logResult('POST /api/auth/login (Admin)', 'PASS', 'Token received');
  } else {
    logResult('POST /api/auth/login (Admin)', 'FAIL', JSON.stringify(adminData));
    return results;
  }

  // 3. Register User
  const userEmail = `user${Date.now()}@test.com`;
  const regUser = await request('POST', '/api/auth/daftar', {
    nama: 'Test User',
    email: userEmail,
    nomorTelepon: '08987654321',
    password: 'User1234',
  });
  if (regUser.status === 201 || regUser.status === 200) {
    logResult('POST /api/auth/daftar', 'PASS', 'User created');
  } else {
    logResult('POST /api/auth/daftar', 'FAIL', JSON.stringify(regUser.data));
  }

  // 4. Login User
  const loginUser = await request('POST', '/api/auth/login', {
    email: userEmail,
    password: 'User1234',
  });

  const userData = loginUser.data as any;
  if (loginUser.status === 200 && userData.data?.token) {
    userToken = userData.data.token;
    logResult('POST /api/auth/login (User)', 'PASS', 'Token received');
  } else {
    logResult('POST /api/auth/login (User)', 'FAIL', JSON.stringify(userData));
    return results;
  }

  // 5. Get Profil
  const profil = await request('GET', '/api/auth/profil', null, userToken);
  if (profil.status === 200) logResult('GET /api/auth/profil', 'PASS', 'OK');
  else logResult('GET /api/auth/profil', 'FAIL', JSON.stringify(profil.data));

  // 6. Admin: Create Barber
  const createBarber = await request(
    'POST',
    '/api/admin/barber',
    {
      nama: 'Top Barber',
      fotoProfilUrl: 'https://example.com/foto.jpg',
      rating: 5,
      statusAktif: true,
    },
    adminToken
  );

  const barberData = createBarber.data as any;
  if (createBarber.status === 201 || createBarber.status === 200) {
    barberId = barberData.data?.id;
    logResult('POST /api/admin/barber', 'PASS', 'Barber created');
  } else {
    logResult('POST /api/admin/barber', 'FAIL', JSON.stringify(barberData));
  }

  // 7. Admin: Create Layanan
  const createLayanan = await request(
    'POST',
    '/api/admin/layanan',
    {
      namaLayanan: 'Potong Rambut Keren',
      harga: 50000,
    },
    adminToken
  );

  const layananData = createLayanan.data as any;
  if (createLayanan.status === 201 || createLayanan.status === 200) {
    layananId = layananData.data?.id;
    logResult('POST /api/admin/layanan', 'PASS', 'Layanan created');
  } else {
    logResult('POST /api/admin/layanan', 'FAIL', JSON.stringify(layananData));
  }

  // 8. Public: Get Barbers
  const getBarbers = await request('GET', '/api/barber');
  if (getBarbers.status === 200) logResult('GET /api/barber', 'PASS', 'List received');
  else logResult('GET /api/barber', 'FAIL', JSON.stringify(getBarbers.data));

  // 9. Public: Get Layanan
  const getLayanan = await request('GET', '/api/layanan');
  if (getLayanan.status === 200) logResult('GET /api/layanan', 'PASS', 'List received');
  else logResult('GET /api/layanan', 'FAIL', JSON.stringify(getLayanan.data));

  // 10. User: Create Booking
  if (barberId && layananId) {
    const createBooking = await request(
      'POST',
      '/api/booking',
      {
        barberId,
        layananId,
        tanggalBooking: new Date().toISOString().split('T')[0],
        jamBooking: 14,
      },
      userToken
    );

    const bookingData = createBooking.data as any;
    if (createBooking.status === 201 || createBooking.status === 200) {
      bookingId = bookingData.data?.id;
      logResult('POST /api/booking', 'PASS', 'Booking created');
    } else {
      logResult('POST /api/booking', 'FAIL', JSON.stringify(bookingData));
    }
  } else {
    logResult('POST /api/booking', 'FAIL', 'Skipped due to missing barber/layanan');
  }

  // 11. User: Get My Booking
  const myBooking = await request('GET', '/api/booking/saya', null, userToken);
  if (myBooking.status === 200) logResult('GET /api/booking/saya', 'PASS', 'History received');
  else logResult('GET /api/booking/saya', 'FAIL', JSON.stringify(myBooking.data));

  // 12. User: Pay (Create Pembayaran)
  if (bookingId) {
    const pay = await request(
      'POST',
      '/api/pembayaran',
      {
        bookingId,
        metodePembayaran: 'TRANSFER',
        jumlah: 50000,
      },
      userToken
    );

    if (pay.status === 201 || pay.status === 200) {
      logResult('POST /api/pembayaran', 'PASS', 'Payment processed');
    } else {
      logResult('POST /api/pembayaran', 'FAIL', JSON.stringify(pay.data));
    }
  } else {
    logResult('POST /api/pembayaran', 'FAIL', 'Skipped due to missing bookingId');
  }

  return results;
}
