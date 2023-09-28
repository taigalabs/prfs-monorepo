import JSONbig from "json-bigint";

export async function api({ path, req }: ApiArg, endpoint: string) {
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
    throw err;
  }
}

export interface ApiArg {
  path: string;
  req: any;
}
