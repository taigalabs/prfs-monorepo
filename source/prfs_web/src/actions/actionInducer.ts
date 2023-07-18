import { Dispatch } from "react";
import { Action } from "./actions";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

export type ActionInducer = (disaptch: Dispatch<Action>, router: AppRouterInstance) => Promise<void>;

export const signIn: ActionInducer = async (dispatch: Dispatch<Action>, router: AppRouterInstance) => {

};
