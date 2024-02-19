// export type PrfsApiResponse<P> = {
//   code: number;
//   error?: any | FetchError;
//   payload: P | null;
// };

export interface FetchError {
  isFetchError: true;
  err: unknown;
}

export type ApiResponse<P> = {
  code: number;
  error?: any | FetchError;
  payload: P | null;
};
