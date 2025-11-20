# Backend Barber Serverless

Backend API serverless untuk sistem booking layanan barber. Dibangun dengan Express.js, TypeScript, TypeORM, dan PostgreSQL, dirancang untuk deployment di Vercel.

## Fitur

- Autentikasi dan otorisasi berbasis JWT
- Manajemen pengguna (registrasi, login, profil)
- Manajemen barber (CRUD untuk admin)
- Manajemen layanan (CRUD untuk admin)
- Sistem booking dengan validasi slot waktu
- Proses pembayaran
- Generate invoice otomatis
- Role-based access control (Admin & Pelanggan)
- Error handling yang konsisten
- Serverless-ready architecture

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: TypeORM
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: class-validator
- **Security**: helmet, cors
- **Deployment**: Vercel Serverless Functions

## Prerequisites

- Node.js (v18 atau lebih tinggi)
- npm atau yarn
- PostgreSQL database (lokal atau cloud seperti Supabase, Railway, Neon)

## Installation

1. Clone repository:
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables (lihat bagian Environment Configuration)

4. Run database migrations (lihat bagian Database Setup)

## Environment Configuration

Copy file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Kemudian edit file `.env` dengan konfigurasi Anda:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/barber_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_EXPIRES_IN=24h

# Application Configuration
NODE_ENV=development
PORT=3000

# Cloud Storage (Optional)
CLOUD_STORAGE_URL=
CLOUD_STORAGE_API_KEY=
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret key untuk JWT token (min 32 karakter) |
| `JWT_EXPIRES_IN` | No | Durasi expiry token JWT (default: 24h) |
| `NODE_ENV` | No | Environment mode (development/production) |
| `PORT` | No | Port untuk local development (default: 3000) |
| `CLOUD_STORAGE_URL` | No | URL cloud storage untuk invoice |
| `CLOUD_STORAGE_API_KEY` | No | API key cloud storage |

## Database Setup

### Create Database

Buat database PostgreSQL baru:

```bash
createdb barber_db
```

Atau gunakan cloud database provider seperti:
- [Supabase](https://supabase.com/)
- [Railway](https://railway.app/)
- [Neon](https://neon.tech/)

### Run Migrations

Generate migration (jika ada perubahan entity):

```bash
npm run migration:generate -- src/infrastruktur/database/migrasi/NamaMigration
```

Run migrations:

```bash
npm run migration:run
```

Revert migration (jika diperlukan):

```bash
npm run migration:revert
```

Show migration status:

```bash
npm run migration:show
```

## Running the Application

### Development Mode

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

### Code Quality

Lint code:
```bash
npm run lint
```

Format code:
```bash
npm run format
```

Type check:
```bash
npm run type-check
```

## API Documentation

Base URL: `http://localhost:3000` (development) atau `https://your-app.vercel.app` (production)

### Health Check

```
GET /health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

### Authentication & User Management

#### Register User
```
POST /api/auth/daftar
Content-Type: application/json

{
  "nama": "John Doe",
  "email": "john@example.com",
  "nomorTelepon": "081234567890",
  "password": "password123"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "status": "sukses",
  "pesan": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "pengguna": {
      "id": "uuid",
      "nama": "John Doe",
      "email": "john@example.com",
      "role": "pelanggan"
    }
  }
}
```

#### Get Profile
```
GET /api/auth/profil
Authorization: Bearer <token>
```

#### Update Profile
```
PUT /api/auth/profil
Authorization: Bearer <token>
Content-Type: application/json

{
  "nama": "John Doe Updated",
  "nomorTelepon": "081234567890"
}
```

### Barber Management

#### Get Active Barbers (Public)
```
GET /api/barber
```

#### Create Barber (Admin Only)
```
POST /api/admin/barber
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "nama": "Barber Name",
  "fotoProfilUrl": "https://example.com/photo.jpg",
  "statusAktif": true
}
```

#### Get All Barbers (Admin Only)
```
GET /api/admin/barber
Authorization: Bearer <admin-token>
```

#### Get Barber by ID (Admin Only)
```
GET /api/admin/barber/:id
Authorization: Bearer <admin-token>
```

#### Update Barber (Admin Only)
```
PUT /api/admin/barber/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "nama": "Updated Name",
  "statusAktif": false
}
```

#### Delete Barber (Admin Only)
```
DELETE /api/admin/barber/:id
Authorization: Bearer <admin-token>
```

### Service Management (Layanan)

#### Get All Services (Public)
```
GET /api/layanan
```

#### Create Service (Admin Only)
```
POST /api/admin/layanan
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "namaLayanan": "Haircut",
  "harga": 50000
}
```

#### Update Service (Admin Only)
```
PUT /api/admin/layanan/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "namaLayanan": "Premium Haircut",
  "harga": 75000
}
```

#### Delete Service (Admin Only)
```
DELETE /api/admin/layanan/:id
Authorization: Bearer <admin-token>
```

### Booking Management

#### Create Booking
```
POST /api/booking
Authorization: Bearer <token>
Content-Type: application/json

{
  "barberId": "uuid",
  "layananId": "uuid",
  "tanggalBooking": "2024-01-15",
  "jamBooking": 14
}
```

Note: `jamBooking` harus antara 9-23 (jam operasional)

#### Get My Bookings
```
GET /api/booking/saya
Authorization: Bearer <token>
```

#### Cancel Booking
```
DELETE /api/booking/:id
Authorization: Bearer <token>
```

#### Get All Bookings (Admin Only)
```
GET /api/admin/booking
Authorization: Bearer <admin-token>
```

### Payment Management

#### Process Payment
```
POST /api/pembayaran
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookingId": "uuid",
  "metodePembayaran": "transfer_bank",
  "jumlah": 50000
}
```

### Invoice Management

#### Get Invoice
```
GET /api/invoice/:id
Authorization: Bearer <token>
```

Response includes invoice details and PDF URL/base64.

## Project Structure

```
backend/
├── src/
│   ├── domain/              # Domain-driven design structure
│   │   ├── barber/          # Barber domain
│   │   ├── booking/         # Booking domain
│   │   ├── invoice/         # Invoice domain
│   │   ├── layanan/         # Service domain
│   │   ├── pembayaran/      # Payment domain
│   │   └── pengguna/        # User domain
│   ├── infrastruktur/       # Infrastructure layer
│   │   ├── database/        # Database configuration
│   │   ├── middleware/      # Express middlewares
│   │   └── util/            # Utility functions
│   ├── konfigurasi/         # Configuration files
│   └── index.ts             # Application entry point
├── .env.example             # Environment variables template
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── vercel.json              # Vercel deployment config
```

## Deployment to Vercel

### Prerequisites

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

### Deploy

1. Pastikan semua environment variables sudah diset di Vercel dashboard

2. Deploy:
```bash
vercel --prod
```

### Environment Variables di Vercel

Set environment variables melalui Vercel dashboard atau CLI:

```bash
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add JWT_EXPIRES_IN
```

### Database Migrations di Production

Setelah deploy, run migrations:

```bash
# Set DATABASE_URL ke production database
export DATABASE_URL="postgresql://..."
npm run migration:run
```

## Error Codes

Aplikasi menggunakan error codes yang konsisten:

| Code | Description |
|------|-------------|
| `AUTH_001` | Email sudah terdaftar |
| `AUTH_002` | Email atau password salah |
| `AUTH_003` | Token tidak valid |
| `AUTH_004` | Token expired |
| `AUTH_005` | Akses ditolak |
| `BARBER_001` | Barber tidak ditemukan |
| `LAYANAN_001` | Layanan tidak ditemukan |
| `BOOKING_001` | Slot sudah dibooking |
| `BOOKING_002` | Jam booking tidak valid |
| `BOOKING_003` | Booking tidak ditemukan |
| `BOOKING_004` | Tidak bisa batalkan booking |
| `PEMBAYARAN_001` | Pembayaran sudah ada |
| `PEMBAYARAN_002` | Status booking tidak valid |
| `INVOICE_001` | Invoice tidak ditemukan |
| `INVOICE_002` | Akses invoice ditolak |

## License

MIT
