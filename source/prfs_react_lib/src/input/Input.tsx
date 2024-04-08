import React, { HTMLInputTypeAttribute } from "react";
import cn from "classnames";

import styles from "./Input.module.scss";
import { Fieldset, InputElement, InputError, InputWrapper, Label } from "./InputComponent";
import { useInput } from "./useInput";

const Input: React.FC<InputProps> = ({
  className,
  inputClassName,
  labelClassName,
  label,
  name,
  value,
  error,
  type,
  disabled,
  readOnly,
  hasError,
  handleChangeValue,
  handleKeyDown,
}) => {
  const { isFocused, handleFocus, handleBlur } = useInput();

  return (
    <>
      <InputWrapper
        className={className}
        isError={!!error || !!hasError}
        isFocused={isFocused}
        hasValue={!!value && value.length > 0}
      >
        <Label className={labelClassName} name={name}>
          {label}
        </Label>
        <Fieldset>{label}</Fieldset>
        <InputElement
          name={name}
          value={value || ""}
          className={inputClassName}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChangeValue}
          type={type}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          disabled={disabled}
        />
      </InputWrapper>
      {error && <InputError>{error}</InputError>}
    </>
  );
};

export default Input;

export interface InputProps {
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
  name?: string;
  value: string | null;
  label: string;
  handleChangeValue?: React.ChangeEventHandler;
  handleKeyDown?: React.KeyboardEventHandler;
  error?: React.ReactNode;
  placeholder?: string;
  type?: HTMLInputTypeAttribute | undefined;
  readOnly?: boolean;
  hasError?: boolean;
}
