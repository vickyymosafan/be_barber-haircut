# Database Infrastructure

Folder ini berisi konfigurasi dan utilities untuk database PostgreSQL menggunakan TypeORM.

## Files

- `koneksi-database.ts` - Singleton pattern untuk database connection (serverless-friendly)
- `base-entitas.ts` - Base entity class dengan common fields (id, createdAt, updatedAt)
- `migrasi/` - Folder untuk migration files

## Database Connection

Sistem menggunakan singleton pattern untuk database connection agar efisien di environment serverless:

```typescript
import { dapatkanKoneksiDatabase } from '@infrastruktur/database/koneksi-database';

// Mendapatkan connection (akan reuse jika sudah ada)
const dataSource = await dapatkanKoneksiDatabase();

// Menggunakan connection
const repository = dataSource.getRepository(EntityName);
```

## Migrations

### Generate Migration

Setelah membuat atau mengubah entity, generate migration:

```bash
npm run migration:generate -- src/infrastruktur/database/migrasi/NamaMigrasi
```

### Run Migrations

Jalankan pending migrations:

```bash
npm run migration:run
```

### Revert Migration

Revert migration terakhir:

```bash
npm run migration:revert
```

### Show Migration Status

Lihat status semua migrations:

```bash
npm run migration:show
```

## Base Entity

Semua entities harus extend `BaseEntitas` untuk mendapatkan common fields:

```typescript
import { Entity, Column } from 'typeorm';
import { BaseEntitas } from '@infrastruktur/database/base-entitas';

@Entity('nama_tabel')
export class NamaEntitas extends BaseEntitas {
  @Column()
  namaField: string;
  
  // BaseEntitas sudah menyediakan:
  // - id: string (UUID)
  // - createdAt: Date
  // - updatedAt: Date
}
```

## Environment Variables

Pastikan environment variables berikut sudah di-set:

- `DATABASE_URL` - PostgreSQL connection string (required)

Format: `postgresql://username:password@host:port/database`

## Serverless Configuration

Connection pool di-set ke 1 untuk serverless environment:

- `max: 1` - Maximum 1 connection per instance
- `connectionTimeoutMillis: 5000` - Timeout 5 detik

Alasan: Serverless functions memiliki keterbatasan connection pool dan lifecycle yang pendek.
