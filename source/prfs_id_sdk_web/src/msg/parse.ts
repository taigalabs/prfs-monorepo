export function parseBuffer(val: string) {
  try {
    const v = JSON.parse(val);
    if (v.data) {
      return Buffer.from(v.data);
    } else {
      console.error("data is not buffer");
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
}
