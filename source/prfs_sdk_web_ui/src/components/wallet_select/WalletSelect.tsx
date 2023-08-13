import React from "react";
import Image from "next/image";
import cn from "classnames";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

import styles from "./WalletSelect.module.scss";
import MetamaskSvg from "@/assets/svg/MetaMask_Fox.svg";
import { i18nContext } from "@/contexts/i18n";
import { GetAddressMsg, sendMsgToParent } from "@taigalabs/prfs-sdk-web";

const walletType = {
  metamask: {
    value: "metamask",
  },
};

const WalletSelect: React.FC<WalletSelectProps> = ({
  selectedVal,
  handleSelectVal,
  walletAddr,
  setWalletAddr,
}) => {
  const i18n = React.useContext(i18nContext);

  const selectElem = React.useMemo(() => {
    return (
      <div className={styles.selectWrapper}>
        <select onChange={handleSelectVal}>
          <option style={{ display: "none" }}></option>
          <option
            value={walletType.metamask.value}
            disabled={selectedVal.value === walletType.metamask.value}
          >
            {walletType.metamask.value}
          </option>
        </select>
        <div className={styles.imgContainer}>
          <Image src={MetamaskSvg} width={24} height={24} alt={selectedVal.value} />
        </div>
        <MdOutlineKeyboardArrowDown />
      </div>
    );
  }, [selectedVal, handleSelectVal]);

  const handleClickConnectWallet = React.useCallback(async () => {
    const reply = await sendMsgToParent(new GetAddressMsg(""));

    setWalletAddr(reply);
  }, [handleSelectVal]);

  return (
    <div className={styles.wrapper}>
      {selectElem}
      <input placeholder={i18n.wallet_address} value={walletAddr} readOnly />
      <button className={styles.connectBtn} onClick={handleClickConnectWallet}>
        {i18n.connect}
      </button>
    </div>
  );
};

export default WalletSelect;

export interface WalletSelectProps {
  selectedVal: WalletTypeValue;
  handleSelectVal: React.ChangeEventHandler<HTMLSelectElement>;
  walletAddr: string | undefined;
  setWalletAddr: React.Dispatch<React.SetStateAction<any>>;
}

export interface WalletTypeValue {
  value: string;
}

export interface WalletEntryProps {
  val: WalletTypeValue;
}
