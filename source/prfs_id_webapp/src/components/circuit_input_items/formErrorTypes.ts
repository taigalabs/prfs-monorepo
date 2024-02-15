import React from "react";

export type FormErrors<T> = {
  [Key in keyof T]: null | React.ReactNode;
};
