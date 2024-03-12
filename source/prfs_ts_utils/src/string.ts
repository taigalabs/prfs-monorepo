export function abbrev5and5(arg: string) {
  return `${arg.substring(0, 5)}...${arg.substring(arg.length - 5)}`;
}

export function abbrevMandN(arg: string, m: number, n: number) {
  return `${arg.substring(0, m)}...${arg.substring(arg.length - n)}`;
}
