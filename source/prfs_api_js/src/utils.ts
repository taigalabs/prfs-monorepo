import JSONbig from "json-bigint";
import { PrfsApiResponse } from "./types";

export type ApiResult<T> = PrfsApiResponse<T> | { fetchError: unknown; payload: null };

export async function api<T>({ path, req }: ApiArg, endpoint: string): Promise<ApiResult<T>> {
  try {
    let res = await fetch(`${endpoint}/${path}`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-type": "application/json",
      },
      body: JSONbig.stringify(req),
    });

    return await res.json();
  } catch (err) {
    return {
      fetchError: err,
      payload: null,
    };
  }
}

export interface ApiArg {
  path: string;
  req: any;
}
