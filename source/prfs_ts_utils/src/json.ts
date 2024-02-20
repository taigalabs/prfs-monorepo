export interface JSONElem {
  __depth: number;
  label: string;
  value: any;
}

export function iterateJSON(obj: Record<string, any>): JSONElem[] {
  const acc = [];
  _iterateJSON(acc, obj, 0);
  return acc;
}

function _iterateJSON(acc: JSONElem[], obj: Record<string, any>, depth: number) {
  for (var k in obj) {
    if (typeof obj[k] == "object" && obj[k] !== null) {
      console.log(11, depth, k, obj[k]);
      acc.push({
        __depth: depth,
        label: k,
        value: undefined,
      });
      _iterateJSON(acc, obj[k], depth + 1);
    } else {
      console.log(22, depth, k, obj[k]);
      acc.push({
        __depth: depth,
        label: k,
        value: obj[k],
      });
    }
    // do something...
  }
}
