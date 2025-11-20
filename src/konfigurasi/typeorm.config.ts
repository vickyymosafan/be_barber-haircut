import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from './environment';

/**
 * DataSource configuration untuk TypeORM CLI
 * Digunakan untuk generate, run, dan revert migrations
 * Alasan: TypeORM CLI membutuhkan DataSource yang di-export untuk migration commands
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: config.database.url,
  entities: [
    // Entities akan ditambahkan saat domain entities dibuat
    // Pattern untuk auto-load semua entities
    'src/domain/**/entitas/*.ts',
  ],
  migrations: ['src/infrastruktur/database/migrasi/*.ts'],
  synchronize: false, // Selalu false untuk production safety
  logging: config.app.nodeEnv === 'development',
  // Migration-specific settings
  migrationsTableName: 'migrasi_typeorm',
  migrationsRun: false, // Jangan auto-run migrations, harus manual
});

/**
 * Initialize DataSource untuk CLI usage
 * Alasan: CLI membutuhkan initialized DataSource
 */
AppDataSource.initialize()
  .then(() => {
    console.log('TypeORM DataSource initialized for CLI');
  })
  .catch(error => {
    console.error('Error initializing TypeORM DataSource:', error);
    process.exit(1);
  });
