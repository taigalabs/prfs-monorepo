export type PrfsApiResponse<P> = {
  code: string;
  error?: any;
  payload: P;
};
