import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntitas } from '@infrastruktur/database/base-entitas';

/**
 * Entitas Barber
 * Alasan: Menyimpan data barber yang memberikan layanan potong rambut
 */
@Entity('barber')
export class Barber extends BaseEntitas {
  @Column({ type: 'varchar', length: 255 })
  nama: string;

  @Column({ name: 'foto_profil_url', type: 'text', nullable: true })
  fotoProfilUrl: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0.0 })
  rating: number;

  @Column({ name: 'status_aktif', type: 'boolean', default: true })
  statusAktif: boolean;

  // Relasi one-to-many ke Booking
  // Alasan: Satu barber bisa memiliki banyak booking
  // Lazy loading untuk performance - hanya load saat dibutuhkan
  @OneToMany('Booking', 'barber', { lazy: true })
  bookings: Promise<unknown[]>;
}
