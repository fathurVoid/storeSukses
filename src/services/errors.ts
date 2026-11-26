import { AxiosError } from 'axios';

export class ApiRequestError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

export function toErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) return error.message;
  if (error instanceof AxiosError) {
    if (error.response)
      return `Server mengembalikan status ${error.response.status}. Silakan coba lagi.`;
    if (error.code === 'ECONNABORTED') return 'Permintaan habis waktu. Silakan coba lagi.';
    return 'Gagal terhubung ke jaringan. Periksa koneksi Anda lalu coba lagi.';
  }
  return 'Terjadi kesalahan saat memuat data.';
}
