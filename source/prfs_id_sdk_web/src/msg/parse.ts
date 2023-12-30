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
