import JSONbig from "json-bigint";
import { PrfsApiResponse } from "./types";

export async function api<T>({ path, req }: ApiArg, endpoint: string): Promise<PrfsApiResponse<T>> {
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
      code: "400000",
      error: err,
      payload: null,
    };
  }
}

export interface ApiArg {
  path: string;
  req: any;
}
