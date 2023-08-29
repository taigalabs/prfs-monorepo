import JSONbig from "json-bigint";

let PRFS_API_SERVER_ENDPOINT: string;

if (typeof process !== "undefined") {
  PRFS_API_SERVER_ENDPOINT = `${process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT}/api/v0`;
} else {
  throw new Error("process is undefined");
}

export async function api({ path, req }: ApiArg) {
  try {
    let res = await fetch(`${PRFS_API_SERVER_ENDPOINT}/${path}`, {
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
