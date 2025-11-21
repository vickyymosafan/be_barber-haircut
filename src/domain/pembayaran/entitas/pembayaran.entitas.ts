import { Entity, Column, OneToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntitas } from '@infrastruktur/database/base-entitas';
import { Booking } from '@domain/booking/entitas/booking.entitas';

/**
 * Status Pembayaran
 * Alasan: Enum untuk status pembayaran
 */
export enum StatusPembayaran {
  PENDING = 'pending',
  BERHASIL = 'berhasil',
  GAGAL = 'gagal',
}

/**
 * Entitas Pembayaran
 * Alasan: Menyimpan data pembayaran untuk booking
 */
@Entity('pembayaran')
export class Pembayaran extends BaseEntitas {
  @Column({ name: 'booking_id', type: 'uuid', unique: true })
  @Index('idx_pembayaran_booking')
  bookingId: string;

  @Column({ name: 'metode_pembayaran', type: 'varchar', length: 50 })
  metodePembayaran: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  jumlah: number;

  @Column({
    name: 'status_pembayaran',
    type: 'enum',
    enum: StatusPembayaran,
    default: StatusPembayaran.PENDING,
  })
  @Index('idx_pembayaran_status')
  statusPembayaran: StatusPembayaran;

  // Relasi OneToOne ke Booking
  // Alasan: Satu pembayaran hanya untuk satu booking
  @OneToOne(() => Booking, booking => booking.pembayaran, { lazy: true })
  @JoinColumn({ name: 'booking_id' })
  booking: Promise<Booking>;
}
