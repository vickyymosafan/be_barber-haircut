/**
 * Response Types
 * Alasan: Type safety untuk response structure
 */
export interface ResponseSukses<T> {
  status: 'success';
  pesan: string;
  data: T;
}

export interface ResponseError {
  status: 'error';
  pesan: string;
  kode?: string;
  detail?: unknown;
}

/**
 * Response Builder Utility
 * Alasan: Menyediakan format response yang konsisten untuk semua API endpoints
 */
export class ResponseBuilder {
  /**
   * Build success response
   * @param data - Data yang akan dikembalikan
   * @param pesan - Pesan sukses (optional, default: "Operasi berhasil")
   * Alasan: Memastikan semua success response memiliki format yang sama
   */
  static sukses<T>(data: T, pesan = 'Operasi berhasil'): ResponseSukses<T> {
    return {
      status: 'success',
      pesan,
      data,
    };
  }

  /**
   * Build error response
   * @param pesan - Pesan error
   * @param kode - Kode error (optional)
   * @param detail - Detail tambahan error (optional)
   * Alasan: Memastikan semua error response memiliki format yang sama
   */
  static error(pesan: string, kode?: string, detail?: unknown): ResponseError {
    const response: ResponseError = {
      status: 'error',
      pesan,
    };

    if (kode) {
      response.kode = kode;
    }

    if (detail !== undefined) {
      response.detail = detail;
    }

    return response;
  }

  /**
   * Build paginated success response
   * @param data - Array data yang akan dikembalikan
   * @param total - Total items
   * @param page - Current page
   * @param limit - Items per page
   * @param pesan - Pesan sukses (optional)
   * Alasan: Menyediakan format konsisten untuk paginated responses
   */
  static suksesPaginated<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
    pesan = 'Data berhasil diambil'
  ): ResponseSukses<{
    items: T[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    return {
      status: 'success',
      pesan,
      data: {
        items: data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  }

  /**
   * Build created response (201)
   * @param data - Data yang baru dibuat
   * @param pesan - Pesan sukses (optional)
   * Alasan: Semantic response untuk resource creation
   */
  static created<T>(data: T, pesan = 'Data berhasil dibuat'): ResponseSukses<T> {
    return this.sukses(data, pesan);
  }

  /**
   * Build updated response
   * @param data - Data yang diupdate
   * @param pesan - Pesan sukses (optional)
   * Alasan: Semantic response untuk resource update
   */
  static updated<T>(data: T, pesan = 'Data berhasil diperbarui'): ResponseSukses<T> {
    return this.sukses(data, pesan);
  }

  /**
   * Build deleted response
   * @param pesan - Pesan sukses (optional)
   * Alasan: Semantic response untuk resource deletion
   */
  static deleted(pesan = 'Data berhasil dihapus'): ResponseSukses<null> {
    return this.sukses(null, pesan);
  }

  /**
   * Build no content response
   * @param pesan - Pesan sukses (optional)
   * Alasan: Semantic response untuk operations without return data
   */
  static noContent(pesan = 'Operasi berhasil'): ResponseSukses<null> {
    return this.sukses(null, pesan);
  }
}
