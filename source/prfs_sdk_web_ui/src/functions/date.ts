export function getYMD() {
  const dateObj = new Date();
  const m = dateObj.getUTCMonth() + 1; //months from 1-12
  const d = dateObj.getUTCDate();
  const y = dateObj.getUTCFullYear();

  return {
    y,
    m,
    d,
  };
}
