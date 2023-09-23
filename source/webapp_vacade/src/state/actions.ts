import { PrfsAccount } from "@taigalabs/prfs-entities/bindings/PrfsAccount";
import { LocalPrfsAccount } from "./userReducer";

export type LoadPrfsAccountPayload = {
  localPrfsAccount: LocalPrfsAccount | null;
};

export type SignInPayload = {
  prfsAccount: PrfsAccount;
  walletAddr: string;
};

export type SignOutPayload = {};

export type SignUpPayload = {
  sig: string;
  id: string;
  walletAddr: string;
};
