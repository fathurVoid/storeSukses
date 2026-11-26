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
    if (error.response) return `The server returned ${error.response.status}. Please try again.`;
    if (error.code === 'ECONNABORTED') return 'The request timed out. Please try again.';
    return 'Network error. Check your connection and try again.';
  }
  return 'Something went wrong while loading data.';
}
