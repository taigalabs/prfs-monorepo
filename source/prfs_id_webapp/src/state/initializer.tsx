"use client";

import React from "react";
import { useAppDispatch } from "./hooks";
import { loadLocalPrfsProofCredential } from "@/storage/local_storage";
import { signInPrfs } from "./userReducer";

export const StateInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    const credential = loadLocalPrfsProofCredential();

    if (credential) {
      dispatch(signInPrfs(credential));
    }
  }, []);

  return children;
};
