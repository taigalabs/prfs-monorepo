type ObjectFromList<T extends ReadonlyArray<string>, V = string> = {
  [K in T extends ReadonlyArray<infer U> ? U : never]: V;
};

export type KeysAsObject<T extends string> = ObjectFromList<ReadonlyArray<T>, string>;

export type RecordOfKeys<T extends string> = {
  [key in T]: any;
};
