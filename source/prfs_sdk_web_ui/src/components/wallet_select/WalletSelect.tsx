import React from "react";
import Image from "next/image";
import cn from "classnames";
import Button from "@taigalabs/prfs-react-components/src/button/Button";

import styles from "./WalletSelect.module.scss";
import MetamaskSvg from "@/assets/svg/MetaMask_Fox.svg";
import { i18nContext } from "@/contexts/i18n";
import { GetAddressMsg, sendMsgToParent } from "@taigalabs/prfs-sdk-web";

const walletData = [
  {
    id: "metamask",
    label: "Metamask",
  },
];

const WalletSelect: React.FC<WalletSelectProps> = ({
  selectedVal,
  handleSelectVal,
  walletAddr,
  setWalletAddr,
}) => {
  const i18n = React.useContext(i18nContext);

  const itemsElem = React.useMemo(() => {
    const elems = [];

    for (const wallet of walletData) {
      let icon;
      switch (wallet.id) {
        case "metamask":
          icon = <Image src={MetamaskSvg} width={24} height={24} alt={wallet.label} />;
          break;
        default:
          continue;
      }

      const elem = (
        <li
          key={wallet.id}
          className={cn({
            [styles.item]: true,
            [styles.selected]: selectedVal && selectedVal.id === wallet.id,
          })}
        >
          <div>{icon}</div>
          <div>{wallet.label}</div>
        </li>
      );

      elems.push(elem);
    }

    return elems;
  }, [selectedVal, handleSelectVal]);

  const handleClickConnectWallet = React.useCallback(async () => {
    const reply = await sendMsgToParent(new GetAddressMsg(""));

    setWalletAddr(reply);
  }, [handleSelectVal]);

  return (
    <div>
      <ul className={styles.walletList}>{itemsElem}</ul>
      <div className={styles.walletStatus}>
        <div className={styles.walletAddr}>
          <input placeholder={i18n.wallet_address} value={walletAddr} readOnly />
          <button onClick={handleClickConnectWallet}>{i18n.connect}</button>
        </div>
      </div>
    </div>
  );
};

export default WalletSelect;

export interface WalletSelectProps {
  selectedVal: WalletType | undefined;
  handleSelectVal: (val: WalletType) => void;
  walletAddr: string | undefined;
  setWalletAddr: React.Dispatch<React.SetStateAction<any>>;
}

export interface WalletType {
  id: string;
  label: string;
}

export interface WalletEntryProps {
  val: WalletType;
}
