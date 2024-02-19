import React from "react";

export function useRerender() {
  const [nonce, rerender] = React.useReducer((x: number) => x + 1, 0);
  return { nonce, rerender };
}
