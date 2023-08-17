import React from "react";
import Image from "next/image";
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
  selectedWallet,
  handleSelectWallet,
  walletAddr,
  handleChangeWalletAddr,
}) => {
  const i18n = React.useContext(i18nContext);

  const selectElem = React.useMemo(() => {
    return (
      <div className={styles.selectWrapper}>
        <select onChange={handleSelectWallet}>
          <option style={{ display: "none" }}></option>
          <option
            value={walletType.metamask.value}
            disabled={selectedWallet.value === walletType.metamask.value}
          >
            {walletType.metamask.value}
          </option>
        </select>
        <div className={styles.imgContainer}>
          <Image src={MetamaskSvg} width={24} height={24} alt={selectedWallet.value} />
        </div>
        <MdOutlineKeyboardArrowDown />
      </div>
    );
  }, [selectedWallet, handleSelectWallet]);

  const handleClickConnectWallet = React.useCallback(async () => {
    const addr = await sendMsgToParent(new GetAddressMsg(""));

    handleChangeWalletAddr(addr);
  }, [handleChangeWalletAddr]);

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
  selectedWallet: WalletTypeValue;
  handleSelectWallet: React.ChangeEventHandler<HTMLSelectElement>;
  walletAddr: string;
  handleChangeWalletAddr: React.Dispatch<React.SetStateAction<any>>;
}

export interface WalletTypeValue {
  value: string;
}

export interface WalletEntryProps {
  val: WalletTypeValue;
}
