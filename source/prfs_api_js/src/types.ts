export type PrfsApiResponse<P> = {
  code: string;
  error?: any | FetchError;
  payload: P | null;
};

export interface FetchError {
  isFetchError: true;
  err: unknown;
}
