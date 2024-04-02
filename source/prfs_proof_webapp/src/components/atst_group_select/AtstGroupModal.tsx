import React from "react";
import cn from "classnames";

import styles from "./AtstGroupModal.module.scss";
// import {
//   CM,
//   CryptoAssetSizeAtstFormData,
//   ENCRYPT_WALLET_ADDR,
//   WALLET_ADDR,
// } from "./create_crypto_asset_atst";
// import EncryptedWalletAddrItem from "./EncryptedWalletAddrItem";
import { useI18N } from "@/i18n/use_i18n";

const Modal: React.FC = () => {
  return <div>Modal</div>;
};

const AtstGroupModal: React.FC<AtstGroupModalProps> = ({}) => {
  const i18n = useI18N();

  return <div className={styles.wrapper}>modal</div>;
};

export default AtstGroupModal;

export interface AtstGroupModalProps {}
