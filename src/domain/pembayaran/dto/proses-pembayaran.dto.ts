import { IsNotEmpty, IsUUID, IsString, IsNumber, Min } from 'class-validator';

/**
 * DTO untuk memproses pembayaran
 * Alasan: Validasi input dari client sebelum diproses
 */
export class ProsesPembayaranDto {
  @IsNotEmpty({ message: 'Booking ID tidak boleh kosong' })
  @IsUUID('4', { message: 'Format Booking ID tidak valid' })
  bookingId: string;

  @IsNotEmpty({ message: 'Metode pembayaran tidak boleh kosong' })
  @IsString({ message: 'Metode pembayaran harus berupa text' })
  metodePembayaran: string;

  @IsNotEmpty({ message: 'Jumlah pembayaran tidak boleh kosong' })
  @IsNumber({}, { message: 'Jumlah pembayaran harus berupa angka' })
  @Min(0, { message: 'Jumlah pembayaran tidak boleh negatif' })
  jumlah: number;
}
