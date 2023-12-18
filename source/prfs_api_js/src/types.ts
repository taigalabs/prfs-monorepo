export type PrfsApiResponse<P> = {
  code: number;
  error?: any | FetchError;
  payload: P;
};

export interface FetchError {
  isFetchError: true;
  err: unknown;
}
