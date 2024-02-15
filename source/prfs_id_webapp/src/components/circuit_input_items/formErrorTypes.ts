export type Transmuted<T> = {
  [Key in keyof T]: any;
};
