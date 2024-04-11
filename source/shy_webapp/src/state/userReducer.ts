import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { LocalShyCredential } from "@/storage/shy_credential";
import { LocalShyCache, LocalShyCacheItem } from "@/storage/shy_cache";

export interface UserState {
  isCredentialInitialized: boolean;
  shyCredential: LocalShyCredential | null;

  //
  isCacheInitialized: boolean;
  shyCache: LocalShyCache;
}

const makeInitialState: () => UserState = () => {
  return {
    isCredentialInitialized: false,
    isCacheInitialized: false,
    shyCredential: null,
    shyCache: {},
  };
};

export const userSlice = createSlice({
  name: "user",
  initialState: makeInitialState(),
  reducers: {
    signInShy: (state: UserState, action: PayloadAction<LocalShyCredential | null>) => {
      return {
        ...state,
        isInitialized: true,
        shyCredential: action.payload,
      };
    },
    initShyCache: (state: UserState, action: PayloadAction<LocalShyCache>) => {
      return {
        ...state,
        isCacheInitialized: true,
        shyCache: action.payload,
      };
    },
    setCache: (state: UserState, action: PayloadAction<LocalShyCacheItem>) => {
      return {
        ...state,
      };
    },
    removeCache: (state: UserState, action: PayloadAction<string>) => {
      const cache = state.cache;
      if (action.payload) {
        delete cache[action.payload];
      }

      return {
        ...state,
      };
    },
    signOutShy: (state: UserState, _action: PayloadAction<void>) => {
      return {
        ...state,
        shyCredential: null,
        cache: {},
      };
    },
  },
});

export const { signInShy, signOutShy } = userSlice.actions;

export const userReducer = userSlice.reducer;
