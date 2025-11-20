import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntitas } from '@infrastruktur/database';

/**
 * Entitas Layanan
 * Alasan: Menyimpan data layanan potong rambut yang ditawarkan
 */
@Entity('layanan')
export class Layanan extends BaseEntitas {
  @Column({ name: 'nama_layanan', type: 'varchar', length: 255 })
  namaLayanan: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  harga: number;

  // Relasi one-to-many ke Booking
  // Alasan: Satu layanan bisa digunakan di banyak booking
  // Lazy loading untuk performance - hanya load saat dibutuhkan
  @OneToMany('Booking', 'layanan', { lazy: true })
  bookings: Promise<unknown[]>;
}
