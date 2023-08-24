export function accessObj(path: any, obj: any, separator = ".") {
  var properties = Array.isArray(path) ? path : path.split(separator);
  return properties.reduce((prev: any, curr: any) => prev?.[curr], obj);
}
