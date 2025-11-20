import { IsNotEmpty, IsString, MinLength, IsNumber, Min } from 'class-validator';

/**
 * DTO untuk membuat layanan baru
 * Alasan: Validasi input dari client sebelum diproses
 */
export class BuatLayananDto {
  @IsNotEmpty({ message: 'Nama layanan tidak boleh kosong' })
  @IsString({ message: 'Nama layanan harus berupa text' })
  @MinLength(3, { message: 'Nama layanan minimal 3 karakter' })
  namaLayanan: string;

  @IsNotEmpty({ message: 'Harga tidak boleh kosong' })
  @IsNumber({}, { message: 'Harga harus berupa angka' })
  @Min(0, { message: 'Harga tidak boleh negatif' })
  harga: number;
}
