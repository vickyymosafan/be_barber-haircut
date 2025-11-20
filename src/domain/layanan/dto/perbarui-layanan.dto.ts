import { IsOptional, IsString, MinLength, IsNumber, Min } from 'class-validator';

/**
 * DTO untuk memperbarui data layanan
 * Alasan: Validasi input dari client sebelum diproses, semua field optional
 */
export class PerbaruiLayananDto {
  @IsOptional()
  @IsString({ message: 'Nama layanan harus berupa text' })
  @MinLength(3, { message: 'Nama layanan minimal 3 karakter' })
  namaLayanan?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Harga harus berupa angka' })
  @Min(0, { message: 'Harga tidak boleh negatif' })
  harga?: number;
}
