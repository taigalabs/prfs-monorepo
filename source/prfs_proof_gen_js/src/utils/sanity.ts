export async function checkIfLive(sdkEndpoint: string) {
  return await fetch(`${sdkEndpoint}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
  });
}
