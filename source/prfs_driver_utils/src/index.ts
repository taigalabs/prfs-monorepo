const hasUint8Array = typeof Uint8Array === "function";

export function isUint8Array(value: any) {
  return hasUint8Array && value instanceof Uint8Array;
}

export function serializePublicInputs(publicInputs: any): string {
  const json = JSON.stringify(publicInputs, (_, value) => {
    if (typeof value === "bigint") {
      value.toString() + "n";
    }

    if (isUint8Array(value)) {
      return Array.from(value);
    }

    return value;
  });

  return json;
}

export function deserializePublicInputs(serPublicInputs: string): any {
  const backAgain = JSON.parse(serPublicInputs, (_, value) => {
    if (typeof value === "string" && /^\d+n$/.test(value)) {
      return BigInt(value.substring(0, value.length - 1));
    }
    return value;
  });

  return backAgain as any;
}
