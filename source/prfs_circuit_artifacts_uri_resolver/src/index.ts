export function resolveWtnsGenUrl(endpoint: string, circuitTypeId: string) {
  return `${endpoint}/${circuitTypeId}/${circuitTypeId}_js/${circuitTypeId}.wasm`;
}

export function resolveCircuitUrl(endpoint: string, circuitTypeId: string) {
  return `${endpoint}/${circuitTypeId}/${circuitTypeId}.spartan.circuit`;
}

export function interpolateSystemAssetEndpoint(
  url: string,
  prfsAssetEndpoint: string,
): string | null {
  return url.replace("prfs://", prfsAssetEndpoint);
}
