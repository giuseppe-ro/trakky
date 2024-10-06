import { AppError } from '@/models/app-error';

export default abstract class BaseClient {
  abstract Get(
    endpoint: string,
    signal?: AbortSignal
  ): Promise<{
    data: unknown;
    error: null | AppError;
  }>;

  abstract Post(
    endpoint: string,
    data: unknown,
    signal?: AbortSignal
  ): Promise<{
    data: boolean;
    error: null | AppError;
  }>;

  abstract Upload(
    endpoint: string,
    file: File,
    signal?: AbortSignal
  ): Promise<null | string>;

  abstract Put(
    endpoint: string,
    data: unknown,
    signal?: AbortSignal
  ): Promise<{
    data: boolean;
    error: null | AppError;
  }>;

  abstract Delete(
    endpoint: string,
    ids: number[],
    signal?: AbortSignal
  ): Promise<{
    data: boolean;
    error: null | AppError;
  }>;
}
