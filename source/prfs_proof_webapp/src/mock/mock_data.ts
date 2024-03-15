const masterAccountIds = [
  "0x0185fda40467453790648c536ee77f9905490944",
  "0xda6870ea13b66dd273c084e0fba28a68de597986",
  "0x8c8f8bd6efa9a6ec31ab4d4fdc9f472a85ef5244",
];

export function isMasterAccountId(id?: string) {
  if (id) {
    return masterAccountIds.includes(id);
  }
  return false;
}
