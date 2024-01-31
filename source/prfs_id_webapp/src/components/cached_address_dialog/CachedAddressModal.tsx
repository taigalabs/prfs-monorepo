import React from "react";
import cn from "classnames";
import { abbrevAddr } from "@taigalabs/prfs-web3-js";
import { useQuery } from "@tanstack/react-query";

import styles from "./CachedAddressModal.module.scss";
import { i18nContext } from "@/i18n/context";
import { PrfsIdCredential } from "@taigalabs/prfs-id-sdk-web";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { makeCommitment } from "@taigalabs/prfs-crypto-js";

function useCachedAddresses(prfsIdCredential: PrfsIdCredential | null) {
  // useQuery;
}

const CachedAddressModal: React.FC<WalletModalProps> = ({
  handleClickClose,
  handleChangeAddress,
}) => {
  const prfsIdCredential = useAppSelector(state => state.user.prfsIdCredential);
  const addresses = useCachedAddresses(prfsIdCredential);

  React.useEffect(() => {
    async function fn() {
      if (prfsIdCredential) {
        // const preImages = ['wallet_']
        // await makeCommitment(
        //   prfsIdCredential.secret_key,
        // );
      }
    }
    fn().then();
  }, []);

  return prfsIdCredential ? (
    <div className={styles.wrapper}>
      <div>power</div>
      {/* {isConnected && connector ? ( */}
      {/*   <ConnectedInfo */}
      {/*     ensName={ensName} */}
      {/*     address={address} */}
      {/*     connector={connector} */}
      {/*     handleChangeAddress={handleChangeAddress} */}
      {/*     handleClickDisconnect={handleClickDisconnect} */}
      {/*     handleClickClose={handleClickClose} */}
      {/*   /> */}
      {/* ) : ( */}
      {/*   connectorsElem */}
      {/* )} */}
      <div></div>
    </div>
  ) : (
    <div>Credential is empty. Something is wrong</div>
  );
};

export default CachedAddressModal;

export interface WalletModalProps {
  handleClickClose: () => void;
  handleChangeAddress: (addr: any) => void;
  // credential: PrfsIdCredential;
}
