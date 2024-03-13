export function abbrev7and5(arg: string) {
  return `${arg.substring(0, 7)}...${arg.substring(arg.length - 5)}`;
}

export function abbrevMandN(arg: string, m: number, n: number) {
  return `${arg.substring(0, m)}...${arg.substring(arg.length - n)}`;
}
