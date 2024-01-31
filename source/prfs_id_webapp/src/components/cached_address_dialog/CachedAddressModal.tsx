import React from "react";
import cn from "classnames";
import { abbrevAddr } from "@taigalabs/prfs-web3-js";

import styles from "./CachedAddressModal.module.scss";
import { i18nContext } from "@/i18n/context";
import { PrfsIdCredential } from "@taigalabs/prfs-id-sdk-web";

const CachedAddressModal: React.FC<WalletModalProps> = ({
  handleClickClose,
  handleChangeAddress,
  credential,
}) => {
  React.useEffect(() => {
    console.log(123);
  }, [credential]);

  return (
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
  );
};

export default CachedAddressModal;

export interface WalletModalProps {
  handleClickClose: () => void;
  handleChangeAddress: (addr: any) => void;
  credential: PrfsIdCredential;
}
