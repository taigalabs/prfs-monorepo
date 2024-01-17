import { PrfsAccount } from "@taigalabs/prfs-entities/bindings/PrfsAccount";

import { LocalShyCredential } from "@/storage/local_storage";

export type LoadShyAccountPayload = {
  localPrfsAccount: LocalShyCredential | null;
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
