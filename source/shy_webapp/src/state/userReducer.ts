import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { LocalShyCredential } from "@/storage/shy_credential";
import { LocalShyCache, LocalShyCacheItem, persistShyCache } from "@/storage/shy_cache";

export interface UserState {
  // credential
  isCredentialInitialized: boolean;
  shyCredential: LocalShyCredential | null;

  // cache
  isCacheInitialized: boolean;
  shyCache: LocalShyCache | null;
}

const makeInitialState: () => UserState = () => {
  return {
    isCredentialInitialized: false,
    isCacheInitialized: false,
    shyCredential: null,
    shyCache: null,
  };
};

export const userSlice = createSlice({
  name: "user",
  initialState: makeInitialState(),
  reducers: {
    signInShy: (state: UserState, action: PayloadAction<LocalShyCredential | null>) => {
      return {
        ...state,
        isCredentialInitialized: true,
        shyCredential: action.payload,
      };
    },
    // signUpShy: (state: UserState, action: PayloadAction<LocalShyCredential>) => {
    //   return {
    //     ...state,
    //     isCredentialInitialized: true,
    //     shyCredential: action.payload,
    //   };
    // },
    // setIsNotFirstTime: (state: UserState, action: PayloadAction<void>) => {
    //   return {
    //     ...state,
    //   };
    // },
    initShyCache: (state: UserState, action: PayloadAction<LocalShyCache | null>) => {
      return {
        ...state,
        isCacheInitialized: true,
        shyCache: action.payload || {},
      };
    },
    setCacheItem: (state: UserState, action: PayloadAction<LocalShyCacheItem>) => {
      // const cache: LocalShyCache = JSON.parse(val);
      const item = action.payload;

      if (item) {
        const newCache = {
          ...state.shyCache,
          [item.key]: item.val,
        };

        // side effect
        persistShyCache(newCache);

        return {
          ...state,
          shyCache: newCache,
        };
      } else {
        return state;
      }
    },
    removeCacheItem: (state: UserState, action: PayloadAction<string>) => {
      const cache = state.shyCache ? state.shyCache : {};

      if (action.payload) {
        delete cache[action.payload];
      }

      persistShyCache(cache);

      return {
        ...state,
        shyCache: {},
      };
    },
    signOutShy: (state: UserState, _action: PayloadAction<void>) => {
      return {
        ...state,
        shyCredential: null,
        shyCache: {},
      };
    },
  },
});

export const { signInShy, signOutShy, initShyCache, setCacheItem, removeCacheItem } =
  userSlice.actions;

export const userReducer = userSlice.reducer;
