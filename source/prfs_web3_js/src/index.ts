export const abbrevAddr = (addr: string) => {
  if (!addr) {
    return "";
  }

  if (addr.length === 42) {
    return `${addr.substring(0, 7)}...${addr.substring(37, 42)}`;
  }
  return "";
};
