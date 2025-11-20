import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity as TypeORMBaseEntity,
} from 'typeorm';

/**
 * Base Entity class untuk semua entities
 * Menyediakan common fields: id, createdAt, updatedAt
 * Alasan: Menghindari duplikasi code dan memastikan konsistensi struktur data
 */
export abstract class BaseEntitas extends TypeORMBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
