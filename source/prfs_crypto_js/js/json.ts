import JSONBig from "json-bigint";

export const JSONbigNative = JSONBig({ useNativeBigInt: true, alwaysParseAsBig: true });
