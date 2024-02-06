let endpoint: string;
if (typeof process !== "undefined") {
  if (!process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT) {
    throw new Error("id session api endpoint not defined");
  }
  const host = process.env.NEXT_PUBLIC_PRFS_API_SERVER_ENDPOINT.replace(
    new RegExp("^https?://"),
    "",
  );
  endpoint = `${host}/id_session_api/v0`;
} else {
  throw new Error("process is undefined");
}

export function openSession() {
  const ws = new WebSocket(`ws://${endpoint}/open_session`);
  return ws;
}
