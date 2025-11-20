import * as bcrypt from 'bcryptjs';

/**
 * Salt Rounds untuk bcrypt
 * Alasan: 10 rounds adalah balance yang baik antara security dan performance
 * Setiap increment menggandakan waktu hashing
 */
const SALT_ROUNDS = 10;

/**
 * Enkripsi Utility untuk password hashing
 * Alasan: Centralized password hashing untuk security consistency
 */
export class EnkripsiUtil {
  /**
   * Hash password menggunakan bcrypt
   * @param password - Plain text password
   * @returns Hashed password
   * Alasan: Password tidak boleh disimpan dalam plain text
   */
  static async hashPassword(password: string): Promise<string> {
    try {
      // Generate salt dan hash password
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      const hash = await bcrypt.hash(password, salt);
      return hash;
    } catch (error) {
      throw new Error(`Gagal melakukan hashing password: ${error}`);
    }
  }

  /**
   * Bandingkan plain password dengan hashed password
   * @param password - Plain text password
   * @param hash - Hashed password dari database
   * @returns True jika password cocok, false jika tidak
   * Alasan: Untuk verifikasi password saat login
   */
  static async bandingkanPassword(password: string, hash: string): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compare(password, hash);
      return isMatch;
    } catch (error) {
      throw new Error(`Gagal membandingkan password: ${error}`);
    }
  }

  /**
   * Validasi kekuatan password
   * @param password - Plain text password
   * @returns Object dengan isValid dan pesan error jika tidak valid
   * Alasan: Memastikan password memenuhi kriteria keamanan minimum
   */
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    pesan?: string;
  } {
    // Minimum 8 karakter
    if (password.length < 8) {
      return {
        isValid: false,
        pesan: 'Password harus minimal 8 karakter',
      };
    }

    // Harus ada huruf
    if (!/[a-zA-Z]/.test(password)) {
      return {
        isValid: false,
        pesan: 'Password harus mengandung huruf',
      };
    }

    // Harus ada angka
    if (!/\d/.test(password)) {
      return {
        isValid: false,
        pesan: 'Password harus mengandung angka',
      };
    }

    return { isValid: true };
  }

  /**
   * Generate random password
   * @param length - Panjang password (default: 12)
   * @returns Random password yang memenuhi kriteria keamanan
   * Alasan: Untuk generate temporary password atau reset password
   */
  static generateRandomPassword(length = 12): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*';
    const allChars = lowercase + uppercase + numbers + symbols;

    let password = '';

    // Pastikan minimal ada 1 dari setiap kategori
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    // Fill sisanya dengan random characters
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle password
    // Alasan: Agar karakter tidak selalu dalam urutan yang sama
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }
}
