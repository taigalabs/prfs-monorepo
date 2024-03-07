import React from "react";

export type FormValues<T> = {
  [Key in keyof T]: undefined | T[Key];
};

export type FormErrors<T> = {
  [Key in keyof T]: undefined | React.ReactNode;
};

export type SetProcessInput<T> = React.Dispatch<
  React.SetStateAction<((formValues: FormValues<T>) => void) | null>
>;
