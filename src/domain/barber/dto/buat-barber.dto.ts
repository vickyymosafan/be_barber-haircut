import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsBoolean,
  IsUrl,
} from 'class-validator';

/**
 * DTO untuk membuat barber baru
 * Alasan: Validasi input dari client sebelum diproses
 */
export class BuatBarberDto {
  @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
  @IsString({ message: 'Nama harus berupa text' })
  @MinLength(3, { message: 'Nama minimal 3 karakter' })
  nama: string;

  @IsOptional()
  @IsString({ message: 'Foto profil URL harus berupa text' })
  @IsUrl({}, { message: 'Format URL foto profil tidak valid' })
  fotoProfilUrl?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Rating harus berupa angka' })
  @Min(0, { message: 'Rating minimal 0' })
  @Max(5, { message: 'Rating maksimal 5' })
  rating?: number;

  @IsOptional()
  @IsBoolean({ message: 'Status aktif harus berupa boolean' })
  statusAktif?: boolean;
}
