export interface ZAuthMsg<T> {
  type: string;
  payload: T;
}

export interface SignInSuccessZAuthMsg {
  type: "SIGN_IN_SUCCESS";
  payload: SignInSuccessPayload;
}

export interface SignInSuccessPayload {
  id: string;
}
