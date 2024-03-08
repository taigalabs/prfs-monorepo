export interface FetchError {
  isFetchError: true;
  err: unknown;
}

export type ApiResponse<P> = {
  code: string;
  error?: any | FetchError;
  payload: P | null;
};
