export function delay(duration: number) {
  return new Promise((resolve, _) => {
    setTimeout(() => {
      resolve(0);
    }, duration);
  });
}
