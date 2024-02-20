export interface JSONElem {
  depth: number;
  label: string;
  value: any;
}

export function iterateJSON(obj: Record<string, any>): JSONElem[] {
  const acc = [];
  _iterateJSON(acc, obj, 0, false);
  return acc;
}

function _iterateJSON(acc: JSONElem[], obj: Record<string, any>, depth: number, isArr: boolean) {
  for (var k in obj) {
    if (typeof obj[k] == "object" && obj[k] !== null) {
      // console.log(11, depth, k, obj[k], isArr);
      if (!isArr) {
        acc.push({
          depth,
          label: k,
          value: undefined,
        });
      }

      const nextIsArr = Array.isArray(obj[k]);
      const nextDepth = nextIsArr ? depth : depth + 1;
      _iterateJSON(acc, obj[k], nextDepth, nextIsArr);
    } else {
      acc.push({
        depth,
        label: k,
        value: obj[k],
      });
    }
  }
}
