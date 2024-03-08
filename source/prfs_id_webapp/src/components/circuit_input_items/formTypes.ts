import React from "react";

export type FormValues<T> = {
  [Key in keyof T]: undefined | T[Key];
};

export type FormErrors<T> = {
  [Key in keyof T]: undefined | React.ReactNode;
};

export type FormHandler = (formValues: FormValues<any>) => Promise<{
  isValid: boolean;
  proofActionResult?: string;
}>;
