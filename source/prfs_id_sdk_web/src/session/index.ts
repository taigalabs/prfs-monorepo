let endpoint: string;
if (typeof process !== "undefined") {
  if (!process.env.NEXT_PUBLIC_PRFS_ID_SESSION_SOCKET_ENDPOINT) {
    throw new Error("id session api endpoint not defined");
  }
  endpoint = `${process.env.NEXT_PUBLIC_PRFS_ID_SESSION_SOCKET_ENDPOINT}/id_session_api/v0`;
} else {
  throw new Error("process is undefined");
}

export function openSession() {
  const ws = new WebSocket(`${endpoint}/open_session`);
  return ws;
}
