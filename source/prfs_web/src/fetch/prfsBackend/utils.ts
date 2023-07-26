const PRFS_API_SERVER_ENDPOINT = `${process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT}/api/v0`;

export async function api({ path, req }: ApiArg) {
  try {
    let res = await fetch(`${PRFS_API_SERVER_ENDPOINT}/${path}`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(req),
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
