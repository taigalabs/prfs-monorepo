export function timeout(prom: Promise<any>, time: number) {
  return Promise.race([prom, new Promise((_r, rej) => setTimeout(rej, time))]);
}
