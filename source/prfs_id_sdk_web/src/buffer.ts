export function parseBuffer(val: string): Buffer {
  try {
    const v = JSON.parse(val);
    if (v.data) {
      return Buffer.from(v.data);
    } else {
      throw new Error("data is not buffer");
    }
  } catch (err) {
    throw err;
  }
}

export function parseBufferOfArray(val: number[]): Buffer {
  try {
    if (val) {
      return Buffer.from(val);
    } else {
      throw new Error("data is not buffer");
    }
  } catch (err) {
    throw err;
  }
}
