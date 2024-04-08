import React from "react";

export function useInput() {
  const [isFocused, setIsFocused] = React.useState(false);
  const handleFocus = React.useCallback(() => {
    setIsFocused(true);
  }, [setIsFocused]);
  const handleBlur = React.useCallback(() => {
    setIsFocused(false);
  }, [setIsFocused]);

  return {
    isFocused,
    handleFocus,
    handleBlur,
  };
}
