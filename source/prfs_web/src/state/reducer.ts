import { Action } from "./actions";

export interface AppState {
  sig: undefined | string;
  id: undefined | string;
  walletAddr: undefined | string;
}

const reducer: (state: AppState, action: Action) => AppState = (
  state: AppState,
  action: Action
) => {
  switch (action.type) {
    case "sign_in":
      return handleSignIn(state, action);
    // return {
    //   ...state,
    // };
    case "sign_up":
      return state;

    default:
      throw new Error("no action handler");
  }
};

export default reducer;

function handleSignIn(state: AppState, action: Action) {
  return state;
}
