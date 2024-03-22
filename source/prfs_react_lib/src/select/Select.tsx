import React from "react";
import cn from "classnames";

import styles from "./Select.module.scss";
import { Fieldset, InputError, InputWrapper, Label } from "../input/InputComponent";

const Select: React.FC<SelectProps> = ({
  className,
  label,
  labelClassName,
  error,
  optionIdx,
  name,
  hasError,
  children,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const handleFocus = React.useCallback(() => {
    setIsFocused(true);
  }, [setIsFocused]);
  const handleBlur = React.useCallback(() => {
    setIsFocused(false);
  }, [setIsFocused]);

  console.log(344, optionIdx);

  return (
    <>
      <InputWrapper
        className={className}
        isError={!!error || !!hasError}
        isFocused={isFocused}
        hasValue={optionIdx > -1}
      >
        <Label className={labelClassName} name={name}>
          {label}
        </Label>
        <Fieldset>{label}</Fieldset>
        <select className={styles.select} onFocus={handleFocus} onBlur={handleBlur}>
          {children}
        </select>
      </InputWrapper>
      {error && <InputError>{error}</InputError>}
    </>
  );
};

export default Select;

export interface SelectProps {
  className?: string;
  labelClassName?: string;
  optionIdx: number;
  children: React.ReactNode;
  error?: React.ReactNode;
  hasError?: boolean;
  label: string;
  name: string;
}
