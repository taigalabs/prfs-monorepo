export interface JSONElem {
  depth: number;
  label: string;
  value: any;
  type: "array" | "value";
}

export function iterateJSON(obj: Record<string, any>): JSONElem[] {
  const acc: JSONElem[] = [];
  _iterateJSON(acc, obj, 0, false);
  return acc;
}

function _iterateJSON(acc: JSONElem[], obj: Record<string, any>, depth: number, isArr: boolean) {
  for (var k in obj) {
    if (typeof obj[k] == "object" && obj[k] !== null) {
      // console.log(11, depth, k, obj[k], isArr);
      const type = isArr ? "array" : "value";
      acc.push({
        depth,
        label: k,
        value: undefined,
        type,
      });

      const nextIsArr = Array.isArray(obj[k]);
      _iterateJSON(acc, obj[k], depth + 1, nextIsArr);
    } else {
      acc.push({
        depth,
        label: k,
        value: obj[k],
        type: "value",
      });
    }
  }
}
